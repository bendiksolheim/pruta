package dev.bendik.models

import dev.bendik.util.filterNonNullPairs
import kotlinx.serialization.Serializable
import com.github.dockerjava.api.model.Image as DockerImage

@Serializable
data class Image (
    val id: String,
    val repo: String,
    val tags: String,
    val size: Long
) {
    companion object {
        fun from(image: DockerImage): Image {
            val reposAndTags = extractReposAndTags(image.repoTags)
            return Image(
                image.id,
                reposAndTags?.map { it.first }?.distinct()?.joinToString(", ") ?: "",
                reposAndTags?.map { it.second }?.distinct()?.joinToString(", ") ?: "<none>",
                image.size
            )
        }
    }
}

fun extractReposAndTags(repoTags: Array<String>?): List<Pair<String, String>>? =
    repoTags?.map { repoAndTag ->
        repoAndTagRegex.matchEntire(repoAndTag)?.let { match ->
            match.groups["repo"]?.value to match.groups["tag"]?.value
        }
    }?.filterNonNullPairs()

val repoAndTagRegex = Regex("""(?<repo>.*):(?<tag>.*)""")