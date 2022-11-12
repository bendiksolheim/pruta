package dev.bendik.models

import com.github.dockerjava.api.command.InspectContainerResponse
import kotlinx.serialization.Serializable

@Serializable
data class ContainerDetails(
    val id: String,
    val name: String,
    val ports: List<String>,
    val image: String,
    val state: String,
    val log: String
) {
    companion object {
        fun from(
            container: InspectContainerResponse,
            log: String
        ): ContainerDetails =
            ContainerDetails(
                container.id,
                container.name,
                container.hostConfig.portBindings.bindings.map {
                    "${it.value.joinToString(", ") { it.hostPortSpec }} -> ${it.key.port}"
                },
                container.config.image ?: "",
                container.state.status ?: "",
                log
            )
    }
}