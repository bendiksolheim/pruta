package dev.bendik.container

import arrow.core.Either
import arrow.core.zip
import com.github.dockerjava.api.DockerClient
import com.github.dockerjava.api.async.ResultCallback
import com.github.dockerjava.api.model.Frame
import io.ktor.http.HttpStatusCode
import io.ktor.http.HttpStatusCode.Companion.BadRequest
import io.ktor.http.HttpStatusCode.Companion.InternalServerError
import io.ktor.http.HttpStatusCode.Companion.NoContent
import io.ktor.http.HttpStatusCode.Companion.OK
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import java.util.concurrent.TimeUnit

fun Route.containerRoutes(dockerClient: DockerClient) {
    get("api/containers") {
        val containers = Either.catch {
            when (call.parameters["filter"]) {
                "running" -> dockerClient.listContainersCmd().exec()
                "exited" -> dockerClient.listContainersCmd().withShowAll(true).exec()
                    .filter { it.state == "exited" }

                else -> dockerClient.listContainersCmd().withShowAll(true).exec()
            }
        }
        containers.fold(
            { call.respond(InternalServerError) },
            { containers -> call.respond(containers.map { Container.from(it) }) }
        )
    }

    get("api/containers/{id}") {
        val id = call.parameters["id"] as String
        val container = Either.catch { dockerClient.inspectContainerCmd(id).exec() }
        val buffer = StringBuffer()
        val callback: ResultCallback.Adapter<Frame> = object : ResultCallback.Adapter<Frame>() {
            override fun onNext(frame: Frame) {
                buffer.append(String(frame.payload))
            }
        }
        val logSuccess = Either.catch {
            dockerClient.logContainerCmd(id)
                .withTail(1000)
                .withStdOut(true)
                .withStdErr(true)
                .exec(callback)
                .awaitCompletion(5, TimeUnit.SECONDS)
        }

        container.zip(logSuccess).fold(
            { call.respond(HttpStatusCode.NotFound) },
            {
                if (it.second) {
                    call.respond(ContainerDetails.from(it.first, buffer.toString()))
                } else {
                    call.respond(ContainerDetails.from(it.first, "Log not available"))
                }
            }
        )
    }

    delete("/api/containers/{id}") {
        val id = call.parameters["id"] as String
        val removed = Either.catch { dockerClient.removeContainerCmd(id).exec() }
            .mapLeft { t -> t.message ?: "Unknown error occured" }
        removed.fold(
            { call.respond(BadRequest, it) },
            { call.respond(NoContent) }
        )
    }

    post("/api/containers/{id}/stop") {
        val id = call.parameters["id"] as String
        val result = Either.catch { dockerClient.stopContainerCmd(id).exec() }

        result.fold({ call.respond(InternalServerError) }, { call.respond(OK) })
    }

    post("/api/containers/{id}/start") {
        val id = call.parameters["id"] as String
        val result = Either.catch { dockerClient.startContainerCmd(id).exec() }

        result.fold({ call.respond(InternalServerError) }, { call.respond(OK) })
    }
}