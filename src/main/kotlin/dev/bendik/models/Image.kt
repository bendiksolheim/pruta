package dev.bendik.models

import kotlinx.serialization.Serializable
import com.github.dockerjava.api.model.Image as DockerImage

@Serializable
data class Image (
    val id: String,
    val repo: String,
    val size: Long
) {
    companion object {
        fun from(image: DockerImage): Image =
            Image(
                image.id,
                image.repoTags.joinToString(", "),
                image.size
            )
    }
}