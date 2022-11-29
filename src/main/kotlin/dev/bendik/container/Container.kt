package dev.bendik.container

import com.github.dockerjava.api.model.Container as DockerContainer
import kotlinx.serialization.Serializable

@Serializable
data class Container(
    val id: String,
    val name: String,
    val image: String,
    val state: String,
    val status: String
) {
    companion object {
        fun from(container: DockerContainer): Container =
            Container(
                container.id,
                container.names.joinToString(", "),
                container.image,
                container.state,
                container.status,
            )

    }
}