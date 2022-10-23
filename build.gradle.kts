val ktor_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
    application
    kotlin("jvm") version "1.7.20"
    id("io.ktor.plugin") version "2.1.2"
    id("org.jetbrains.kotlin.plugin.serialization") version "1.7.20"
    id("org.siouan.frontend-jdk11") version "6.0.0"
    id("com.bmuschko.docker-java-application") version "8.1.0"
}

group = "dev.bendik"
version = "0.0.1"
application {
    mainClass.set("io.ktor.server.cio.EngineMain")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

frontend {
    nodeVersion.set("16.13.2")
    assembleScript.set("run build")
    packageJsonDirectory.set(File("frontend"))
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-host-common-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-status-pages-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-cors-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-call-logging-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktor_version")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-cio-jvm:$ktor_version")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("com.github.docker-java:docker-java:3.2.13")
    testImplementation("io.ktor:ktor-server-tests-jvm:$ktor_version")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}

val processFrontendResources by tasks.registering(Copy::class) {
    dependsOn(":assembleFrontend")
    from(file("frontend/dist"))
    into(file("src/main/resources/www"))
}

tasks.named("processResources") {
    dependsOn(processFrontendResources)
}

val dockerUsername: String = System.getenv("DOCKER_USERNAME") ?: ""
val dockerAccessToken: String = System.getenv("DOCKER_ACCESS_TOKEN") ?: ""

docker {
    registryCredentials {
        username.set(dockerUsername)
        password.set(dockerAccessToken)
    }

    javaApplication {
        maintainer.set("Bendik Solheim, 'hello@bendik.dev'")
        ports.set(listOf(8080))
        images.addAll("bendiksolheim/pruta:latest")
    }
}