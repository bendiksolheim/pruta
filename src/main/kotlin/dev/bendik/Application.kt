package dev.bendik

import io.ktor.server.application.*
import dev.bendik.plugins.*
import com.github.dockerjava.core.DefaultDockerClientConfig
import com.github.dockerjava.core.DockerClientBuilder
import dev.bendik.container.containerRoutes
import dev.bendik.image.imageRoutes
import dev.bendik.network.networkRoutes
import dev.bendik.plugins.configureHTTP
import dev.bendik.plugins.configureMonitoring
import dev.bendik.plugins.configureRouting
import dev.bendik.plugins.configureSerialization
import io.ktor.server.http.content.singlePageApplication
import io.ktor.server.routing.routing

fun main(args: Array<String>): Unit =
    io.ktor.server.cio.EngineMain.main(args)

@Suppress("unused")
fun Application.module() {
    configureHTTP()
    configureMonitoring()
    configureSerialization()
    configureRouting()


    val socket = environment.config.property("ktor.docker.socket").getString()
    this.log.info("Socket: {}", socket)
    val dockerClientConfig = DefaultDockerClientConfig.createDefaultConfigBuilder()
        .withDockerHost(socket)
        .build()
    val dockerClient = DockerClientBuilder.getInstance(dockerClientConfig).build()
    this.log.info("Docker version: {}", dockerClient.versionCmd().exec())

    routing {
        containerRoutes(dockerClient)
        imageRoutes(dockerClient)
        networkRoutes(dockerClient)

        singlePageApplication {
            useResources = true
            filesPath = "www"
            defaultPage = "index.html"
        }
    }
}
