package bendik.dev

import io.ktor.server.application.*
import bendik.dev.plugins.*
import com.github.dockerjava.core.DefaultDockerClientConfig
import com.github.dockerjava.core.DockerClientBuilder
import io.ktor.server.http.content.singlePageApplication
import io.ktor.server.routing.routing

fun main(args: Array<String>): Unit =
    io.ktor.server.cio.EngineMain.main(args)

@Suppress("unused") // application.conf references the main function. This annotation prevents the IDE from marking it as unused.
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

    dockerRoutes(dockerClient)
    routing {
        singlePageApplication {
            useResources = true
            filesPath = "www"
            defaultPage = "index.html"
        }
    }
}
