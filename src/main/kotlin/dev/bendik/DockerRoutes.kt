package dev.bendik

import dev.bendik.models.Container
import dev.bendik.models.Image
import dev.bendik.models.ContainerDetails
import com.github.dockerjava.api.DockerClient
import com.github.dockerjava.api.async.ResultCallback
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import com.github.dockerjava.api.model.Frame
import java.util.concurrent.TimeUnit

fun Application.dockerRoutes(dockerClient: DockerClient) {
    routing {
        get("api/containers") {
            val containers = when (call.parameters["filter"]) {
                "running" -> dockerClient.listContainersCmd().exec()
                "exited" -> dockerClient.listContainersCmd().withShowAll(true).exec().filter { it.state == "exited" }
                else -> dockerClient.listContainersCmd().withShowAll(true).exec()
            }
            call.respond(containers.map { Container.from(it) })
        }

        get("api/images") {
            val images = dockerClient.listImagesCmd().exec()
            call.respond(images.map { Image.from(it) })
        }

        get("api/log/{id}") {
            val id = call.parameters["id"] as String
            val container = dockerClient.inspectContainerCmd(id).exec()
            val buffer = StringBuffer()
            val callback: ResultCallback.Adapter<Frame> = object : ResultCallback.Adapter<Frame>() {
                override fun onNext(frame: Frame) {
                    buffer.append(String(frame.payload))
                }
            }
            dockerClient.logContainerCmd(id)
                .withStdOut(true)
                .withStdErr(true)
                .exec(callback)
                .awaitCompletion(5, TimeUnit.SECONDS)

            call.respond(ContainerDetails.from(container, buffer.toString()))
        }
    }
}