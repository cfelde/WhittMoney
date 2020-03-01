package money.whitt

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.SerializationFeature
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.locations.Locations
import io.ktor.locations.patch
import io.ktor.request.path
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.delete
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.routing
import org.slf4j.event.Level
import java.util.concurrent.atomic.AtomicLong

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    val nextId = AtomicLong(0)
    val orders = hashMapOf<Long, Order>()

    install(Locations) {
    }

    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/") }
    }

    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        method(HttpMethod.Patch)
        header(HttpHeaders.Authorization)
        header("MyCustomHeader")
        allowCredentials = true
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }

    routing {
        get("/book") {
            call.respond(orders)
        }

        post("/order") {
            val orderRequest = call.receive<OrderRequest>()
            val order = Order(nextId.getAndIncrement(), orderRequest)
            orders[order.id] = order
            call.respond(HttpStatusCode.OK, order.id)
        }

        post("/order/fulfill") {
            val fulfillRequest = call.receive<FulfillRequest>()
            if (orders.containsKey(fulfillRequest.orderId)) {
                orders[fulfillRequest.orderId]?.fulfilled = true

                call.respond(HttpStatusCode.OK, "ok")
            } else {
                call.respond(HttpStatusCode.BadRequest, "Order does not exist")
            }
        }

        delete("/order") {
            val orderId = call.receive<Long>()
            if (!orders.containsKey(orderId)) {
                call.respond(HttpStatusCode.BadRequest, "Order does not exist")
            } else {
                orders.remove(orderId)
                call.respond(HttpStatusCode.OK, orderId)
            }
        }
    }
}

class OrderRequest @JsonCreator constructor(
    @JsonProperty("address") val address: String,
    @JsonProperty("creatorAddress") val creatorAddress: String,
    @JsonProperty("collateral") val collateral: Long,
    @JsonProperty("desiredReward") val desiredReward: Long,
    @JsonProperty("duration") val duration: Long,
    @JsonProperty("fulfilled") val fulfilled: Boolean
)

class FulfillRequest @JsonCreator constructor(
    @JsonProperty("orderId") val orderId: Long
)

class Order (
    id: Long,
    orderRequest: OrderRequest
) {
    val id: Long = id
    val address: String = orderRequest.address
    val creatorAddress: String = orderRequest.creatorAddress
    val collateral: Long = orderRequest.collateral
    val desiredReward: Long = orderRequest.desiredReward
    val duration: Long = orderRequest.duration
    var fulfilled: Boolean = orderRequest.fulfilled
}

