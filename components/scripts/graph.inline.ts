// @ts-nocheck
// Forked from @quartz-community/graph 1.0.0. Draws with Canvas 2D and bundles only the d3
// modules it needs, instead of loading d3 and PixiJS (~420KB) from a CDN on every page. It
// only redraws while the simulation moves or the view changes, and navigates via SPA.
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  forceRadial,
} from "d3-force"
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom"
import { drag as d3Drag } from "d3-drag"
import { select } from "d3-selection"
import {
  removeAllChildren,
  getBasePath,
  getFullSlugFromUrl,
  simplifySlug,
  resolveBasePath,
} from "@quartz-community/utils"

function getSlugFromUrl() {
  var slug = getFullSlugFromUrl()
  var base = getBasePath()
  if (base && slug.startsWith(base.replace(/^\//, ""))) {
    slug = slug.slice(base.replace(/^\//, "").length)
    if (slug.startsWith("/")) slug = slug.slice(1)
  }
  return slug
}

var localStorageKey = "graph-visited"

function getVisited() {
  return new Set(JSON.parse(localStorage.getItem(localStorageKey) || "[]"))
}

function addToVisited(slug) {
  var visited = getVisited()
  visited.add(slug)
  localStorage.setItem(localStorageKey, JSON.stringify(Array.from(visited)))
}

function navigateTo(slug) {
  var target = resolveBasePath(slug)
  if (window.spaNavigate) {
    window.spaNavigate(new URL(target, window.location.toString()))
  } else {
    window.location.href = target
  }
}

async function renderGraph(graph, fullSlug, renderGeneration) {
  var slug = simplifySlug(fullSlug)
  if (slug === "") slug = "index"
  var visited = getVisited()
  removeAllChildren(graph)

  if (renderGeneration !== undefined && renderGeneration !== currentRenderGeneration) {
    return function () {}
  }

  var config = JSON.parse(graph.dataset["cfg"] || "{}")
  var enableDrag = config.drag
  var enableZoom = config.zoom
  var depth = config.depth
  var scale = config.scale || 1
  var repelForce = config.repelForce || 0.5
  var centerForce = config.centerForce || 0.3
  var linkDistance = config.linkDistance || 30
  var fontSize = config.fontSize || 0.6
  var opacityScale = config.opacityScale || 1
  var removeTags = config.removeTags || []
  var showTags = config.showTags
  var focusOnHover = config.focusOnHover
  var enableRadial = config.enableRadial

  var data
  try {
    var dataRaw = await fetchData
    data = new Map()
    for (var key in dataRaw) {
      data.set(simplifySlug(key), dataRaw[key])
    }
  } catch (err) {
    console.error("[Graph] Error loading data:", err)
    return function () {}
  }

  var width = graph.offsetWidth
  var height = Math.max(graph.offsetHeight, 250)

  var links = []
  var allTags = []
  var validLinks = new Set(data.keys())

  data.forEach(function (details, source) {
    var outgoing = details.links || []
    for (var i = 0; i < outgoing.length; i++) {
      var dest = simplifySlug(outgoing[i])
      if (validLinks.has(dest)) {
        links.push({ source: source, target: dest })
      }
    }

    if (showTags) {
      var tags = details.tags || []
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i]
        if (removeTags.indexOf(tag) === -1) {
          var tagSlug = simplifySlug("tags/" + tag)
          if (allTags.indexOf(tagSlug) === -1) {
            allTags.push(tagSlug)
          }
          links.push({ source: source, target: tagSlug })
        }
      }
    }
  })

  var neighbourhood = new Set()
  if (depth >= 0) {
    var queue = [slug]
    var seen = new Set([slug])
    for (var d = 0; d <= depth && queue.length > 0; d++) {
      var nextQueue = []
      for (var qi = 0; qi < queue.length; qi++) {
        var cur = queue[qi]
        neighbourhood.add(cur)
        for (var li = 0; li < links.length; li++) {
          var link = links[li]
          if (link.source === cur && !seen.has(link.target)) {
            seen.add(link.target)
            nextQueue.push(link.target)
          }
          if (link.target === cur && !seen.has(link.source)) {
            seen.add(link.source)
            nextQueue.push(link.source)
          }
        }
      }
      queue = nextQueue
    }
  } else {
    validLinks.forEach(function (id) {
      neighbourhood.add(id)
    })
    for (var i = 0; i < allTags.length; i++) {
      neighbourhood.add(allTags[i])
    }
  }

  var nodes = []
  var nodeMap = new Map()
  neighbourhood.forEach(function (url) {
    var isTag = url.startsWith("tags/")
    var node = {
      id: url,
      text: isTag ? "#" + url.substring(5) : data.get(url)?.title || url,
      isTag: isTag,
      degree: 0,
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      vx: 0,
      vy: 0,
    }
    nodes.push(node)
    nodeMap.set(url, node)
  })

  var graphLinks = []
  for (var i = 0; i < links.length; i++) {
    var sourceNode = nodeMap.get(links[i].source)
    var targetNode = nodeMap.get(links[i].target)
    if (sourceNode && targetNode) {
      graphLinks.push({ source: sourceNode, target: targetNode })
      sourceNode.degree++
      targetNode.degree++
    }
  }

  function nodeRadius(d) {
    return 2 + Math.sqrt(d.degree)
  }

  var styles = getComputedStyle(document.documentElement)
  var color = function (name, fallback) {
    return styles.getPropertyValue(name).trim() || fallback
  }
  var secondary = color("--secondary", "#c792ea")
  var tertiary = color("--tertiary", "#82aaff")
  var gray = color("--gray", "#6c6c6c")
  var lightgray = color("--lightgray", "#d4d4d4")
  var dark = color("--dark", "#1a1a1a")
  var light = color("--light", "#f5f5f5")
  var bodyFont = color("--bodyFont", "sans-serif")

  function nodeColor(d) {
    if (d.id === slug) return secondary
    if (d.isTag || visited.has(d.id)) return tertiary
    return gray
  }

  var dpr = window.devicePixelRatio || 1
  var canvas = document.createElement("canvas")
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + "px"
  canvas.style.height = height + "px"
  graph.appendChild(canvas)
  var ctx = canvas.getContext("2d")

  var transform = zoomIdentity
  var hoveredId = null
  var hoveredNeighbours = new Set()
  var dragging = false
  var dragStartTime = 0

  function setHovered(id) {
    hoveredId = id
    hoveredNeighbours = new Set()
    if (id === null) return
    hoveredNeighbours.add(id)
    for (var i = 0; i < graphLinks.length; i++) {
      var l = graphLinks[i]
      if (l.source.id === id || l.target.id === id) {
        hoveredNeighbours.add(l.source.id)
        hoveredNeighbours.add(l.target.id)
      }
    }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.translate(transform.x, transform.y)
    ctx.scale(transform.k, transform.k)
    ctx.translate(width / 2, height / 2)

    ctx.lineWidth = 1
    for (var i = 0; i < graphLinks.length; i++) {
      var l = graphLinks[i]
      var active = hoveredId !== null && (l.source.id === hoveredId || l.target.id === hoveredId)
      ctx.globalAlpha = hoveredId === null || active ? 1 : 0.2
      ctx.strokeStyle = active ? gray : lightgray
      ctx.beginPath()
      ctx.moveTo(l.source.x, l.source.y)
      ctx.lineTo(l.target.x, l.target.y)
      ctx.stroke()
    }

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i]
      ctx.globalAlpha = hoveredId !== null && focusOnHover && !hoveredNeighbours.has(n.id) ? 0.2 : 1
      ctx.beginPath()
      ctx.arc(n.x, n.y, nodeRadius(n), 0, 2 * Math.PI)
      ctx.fillStyle = n.isTag ? light : nodeColor(n)
      ctx.fill()
      if (n.isTag) {
        ctx.lineWidth = 2
        ctx.strokeStyle = tertiary
        ctx.stroke()
        ctx.lineWidth = 1
      }
    }

    // labels fade in as you zoom; the hovered node's label is always shown, slightly larger
    var zoomOpacity = Math.max((transform.k * opacityScale - 1) / 3.75, 0)
    ctx.textAlign = "center"
    ctx.textBaseline = "bottom"
    ctx.fillStyle = dark
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i]
      var isHovered = n.id === hoveredId
      var alpha = isHovered ? 1 : zoomOpacity
      if (alpha <= 0) continue
      var size = (fontSize * 15) / scale
      if (isHovered) size *= 1.1
      ctx.globalAlpha = Math.min(alpha, 1)
      ctx.font = size + "px " + bodyFont
      ctx.fillText(n.text, n.x, n.y - size * 0.2)
    }
    ctx.globalAlpha = 1
  }

  var frame = 0
  function requestDraw() {
    if (frame) return
    frame = requestAnimationFrame(function () {
      frame = 0
      draw()
    })
  }

  var simulation = forceSimulation(nodes)
    .force("charge", forceManyBody().strength(-100 * repelForce))
    .force("center", forceCenter().strength(centerForce))
    .force("link", forceLink(graphLinks).distance(linkDistance))
    .force("collide", forceCollide(nodeRadius).iterations(3))
    .on("tick", requestDraw)

  if (enableRadial) {
    simulation.force("radial", forceRadial((Math.min(width, height) / 2) * 0.8).strength(0.2))
  }

  // pointer position -> simulation coordinates
  function toSim(px, py) {
    return [
      (px - transform.x) / transform.k - width / 2,
      (py - transform.y) / transform.k - height / 2,
    ]
  }

  function nodeAt(px, py) {
    var p = toSim(px, py)
    for (var i = nodes.length - 1; i >= 0; i--) {
      var n = nodes[i]
      var dx = p[0] - n.x
      var dy = p[1] - n.y
      if (Math.sqrt(dx * dx + dy * dy) < nodeRadius(n) + 5 / transform.k) return n
    }
    return null
  }

  function onPointerMove(e) {
    if (dragging) return
    var n = nodeAt(e.offsetX, e.offsetY)
    var id = n ? n.id : null
    canvas.style.cursor = n ? "pointer" : ""
    if (id !== hoveredId) {
      setHovered(id)
      requestDraw()
    }
  }

  function onPointerLeave() {
    if (dragging || hoveredId === null) return
    setHovered(null)
    requestDraw()
  }

  canvas.addEventListener("pointermove", onPointerMove)
  canvas.addEventListener("pointerleave", onPointerLeave)

  if (enableDrag) {
    var drag = d3Drag()
      .container(canvas)
      .subject(function (event) {
        return nodeAt(event.x, event.y)
      })
      .on("start", function (event) {
        if (!event.active) simulation.alphaTarget(1).restart()
        var p = toSim(event.x, event.y)
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
        event.subject.__dragOffset = { x: p[0] - event.subject.x, y: p[1] - event.subject.y }
        dragStartTime = Date.now()
        dragging = true
        setHovered(event.subject.id)
      })
      .on("drag", function (event) {
        var p = toSim(event.x, event.y)
        event.subject.fx = p[0] - event.subject.__dragOffset.x
        event.subject.fy = p[1] - event.subject.__dragOffset.y
      })
      .on("end", function (event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
        dragging = false
        setHovered(null)
        requestDraw()
        if (Date.now() - dragStartTime < 500) {
          navigateTo(event.subject.id)
        }
      })
    select(canvas).call(drag)
  } else {
    canvas.addEventListener("click", function (e) {
      var n = nodeAt(e.offsetX, e.offsetY)
      if (n) navigateTo(n.id)
    })
  }

  if (enableZoom) {
    select(canvas).call(
      d3Zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.25, 4])
        .on("zoom", function (event) {
          transform = event.transform
          requestDraw()
        }),
    )
  }

  return function () {
    simulation.stop()
    if (frame) cancelAnimationFrame(frame)
    canvas.removeEventListener("pointermove", onPointerMove)
    canvas.removeEventListener("pointerleave", onPointerLeave)
    canvas.remove()
  }
}

var localCleanups = []
var globalCleanups = []
var currentRenderGeneration = 0

function cleanupLocal() {
  for (var i = 0; i < localCleanups.length; i++) localCleanups[i]()
  localCleanups = []
}

function cleanupGlobal() {
  for (var i = 0; i < globalCleanups.length; i++) globalCleanups[i]()
  globalCleanups = []
}

var globalContainers = []
var globalIcons = []
var documentClickHandler = null
var documentKeydownHandler = null
var iconClickHandler = null

function hideGlobalGraph() {
  cleanupGlobal()
  for (var i = 0; i < globalContainers.length; i++) {
    globalContainers[i].classList.remove("active")
    var sidebar = globalContainers[i].closest(".sidebar")
    if (sidebar) sidebar.style.zIndex = ""
  }
}

function anyGlobalGraphActive() {
  for (var i = 0; i < globalContainers.length; i++) {
    if (globalContainers[i].classList.contains("active")) return true
  }
  return false
}

function showGlobalGraph() {
  cleanupGlobal()
  var currentSlug = getSlugFromUrl()
  for (var i = 0; i < globalContainers.length; i++) {
    var container = globalContainers[i]
    container.classList.add("active")
    var sidebar = container.closest(".sidebar")
    if (sidebar) sidebar.style.zIndex = "1"

    var graphContainer = container.querySelector(".global-graph-container")
    if (graphContainer) {
      renderGraph(graphContainer, currentSlug, undefined)
        .then(function (cleanup) {
          globalCleanups.push(cleanup)
        })
        .catch(function (err) {
          console.error("[Graph] Global render error:", err)
        })
    }
  }
}

function toggleGlobalGraph() {
  if (anyGlobalGraphActive()) {
    hideGlobalGraph()
  } else {
    showGlobalGraph()
  }
}

function renderLocal() {
  cleanupLocal()
  var thisGeneration = ++currentRenderGeneration
  var slug = getSlugFromUrl()
  addToVisited(slug)

  var localContainers = document.querySelectorAll(".graph-container")
  for (var i = 0; i < localContainers.length; i++) {
    renderGraph(localContainers[i], slug, thisGeneration)
      .then(function (cleanup) {
        if (thisGeneration === currentRenderGeneration) {
          localCleanups.push(cleanup)
        } else {
          cleanup()
        }
      })
      .catch(function (err) {
        console.error("[Graph] Local render error:", err)
      })
  }
}

function handleNav(e) {
  var slug = e.detail ? e.detail.url : getSlugFromUrl()
  addToVisited(simplifySlug(slug))

  renderLocal()

  globalContainers = Array.from(document.querySelectorAll(".global-graph-outer"))

  if (iconClickHandler) {
    for (var i = 0; i < globalIcons.length; i++) {
      globalIcons[i].removeEventListener("click", iconClickHandler)
    }
  }

  globalIcons = Array.from(document.querySelectorAll(".global-graph-icon"))
  iconClickHandler = function () {
    toggleGlobalGraph()
  }
  for (var i = 0; i < globalIcons.length; i++) {
    globalIcons[i].addEventListener("click", iconClickHandler)
  }

  if (documentClickHandler) document.removeEventListener("click", documentClickHandler)
  documentClickHandler = function (e) {
    if (anyGlobalGraphActive()) {
      var inContainer = e.target.closest(".global-graph-container")
      var inIcon = e.target.closest(".global-graph-icon")
      if (!inContainer && !inIcon) hideGlobalGraph()
    }
  }
  document.addEventListener("click", documentClickHandler)

  if (documentKeydownHandler) document.removeEventListener("keydown", documentKeydownHandler)
  documentKeydownHandler = function (e) {
    if (e.key === "Escape") {
      if (anyGlobalGraphActive()) hideGlobalGraph()
      return
    }
    if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault()
      toggleGlobalGraph()
    }
  }
  document.addEventListener("keydown", documentKeydownHandler)

  if (anyGlobalGraphActive()) showGlobalGraph()
}

document.addEventListener("prenav", function () {
  cleanupLocal()
  cleanupGlobal()
})
document.addEventListener("nav", handleNav)
document.addEventListener("themechange", function () {
  renderLocal()
  if (anyGlobalGraphActive()) showGlobalGraph()
})
