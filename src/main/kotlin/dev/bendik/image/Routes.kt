package dev.bendik.image

import arrow.core.Either
import com.github.dockerjava.api.DockerClient
import io.ktor.http.HttpStatusCode.Companion.BadRequest
import io.ktor.http.HttpStatusCode.Companion.InternalServerError
import io.ktor.http.HttpStatusCode.Companion.NoContent
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get

fun Route.imageRoutes(dockerClient: DockerClient) {
    get("api/images") {
        val images = Either.catch { dockerClient.listImagesCmd().exec() }
        images.fold(
            { call.respond(InternalServerError) },
            { images -> call.respond(images.map { image -> Image.from(image) }) }
        )
    }

    delete("/api/images/{id}") {
        val id = call.parameters["id"] as String
        val deleted = Either
            .catch { dockerClient.removeImageCmd(id).exec() }
            .mapLeft { t ->
                t.message ?: "Unknown error occured"
            }
        deleted.fold(
            { call.respond(BadRequest, it) },
            { call.respond(NoContent) }
        )
    }
}