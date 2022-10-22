package bendik.dev.models

import com.github.dockerjava.api.command.InspectContainerResponse
import kotlinx.serialization.Serializable

@Serializable
data class ContainerDetails(
    val id: String,
    val name: String,
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
                container.config.image ?: "",
                container.state.status ?: "",
                log
            )
    }
}