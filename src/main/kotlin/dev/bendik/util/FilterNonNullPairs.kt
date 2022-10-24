package dev.bendik.util

fun <T : Any, U: Any> Iterable<Pair<T?, U?>?>.filterNonNullPairs(): List<Pair<T, U>> {
    val destination = ArrayList<Pair<T, U>>()
    for (element in this) if (element?.first != null && element.second != null) destination.add(element.first!! to element.second!!)
    return destination
}
