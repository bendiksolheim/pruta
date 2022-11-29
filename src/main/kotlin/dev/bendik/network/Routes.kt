package dev.bendik.network

import arrow.core.Either
import com.github.dockerjava.api.DockerClient
import io.ktor.http.HttpStatusCode.Companion.InternalServerError
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get

fun Route.networkRoutes(dockerClient: DockerClient) {

    get("/api/networks") {
        val networks = Either.catch { dockerClient.listNetworksCmd().exec() }
        networks.fold(
            { t -> call.respond(InternalServerError, t) },
            { networks -> call.respond(networks.map { Network.from(it) }) }
        )
    }
}