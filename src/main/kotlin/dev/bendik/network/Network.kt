package dev.bendik.network

import kotlinx.serialization.Serializable

@Serializable
data class Network(
    val id: String,
    val name: String,
    val driver: String
) {
    companion object {
        fun from(network: com.github.dockerjava.api.model.Network): Network =
            Network(network.id, network.name, network.driver)
    }
}