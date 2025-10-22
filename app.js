const tabRegex = document.getElementById("tab-regex")
const tabGrammar = document.getElementById("tab-grammar")
const regexSection = document.getElementById("regex-section")
const grammarSection = document.getElementById("grammar-section")

const modeText = document.getElementById("mode-text")
const modeFile = document.getElementById("mode-file")
const modeUrl = document.getElementById("mode-url")
const inputText = document.getElementById("input-text")
const inputFile = document.getElementById("input-file")
const inputUrl = document.getElementById("input-url")

const textInput = document.getElementById("text-input")
const fileInput = document.getElementById("file-input")
const urlInput = document.getElementById("url-input")
const loadUrlButton = document.getElementById("load-url")

const regexInput = document.getElementById("regex-input")
const flagI = document.getElementById("flag-i")
const flagG = document.getElementById("flag-g")
const flagM = document.getElementById("flag-m")
const searchButton = document.getElementById("search-button")
const resultsDiv = document.getElementById("results")
const statsDiv = document.getElementById("stats")
const matchCount = document.getElementById("match-count")
const lineCount = document.getElementById("line-count")

const grammarSelect = document.getElementById("grammar-select")
const grammarDescription = document.getElementById("grammar-description")
const generateCount = document.getElementById("generate-count")
const generateButton = document.getElementById("generate-button")
const generatedResults = document.getElementById("generated-results")
const copyAllButton = document.getElementById("copy-all")

let currentText = ""

tabRegex.addEventListener("click", () => {
  tabRegex.classList.add("active")
  tabGrammar.classList.remove("active")
  regexSection.classList.add("active")
  grammarSection.classList.remove("active")
})

tabGrammar.addEventListener("click", () => {
  tabGrammar.classList.add("active")
  tabRegex.classList.remove("active")
  grammarSection.classList.add("active")
  regexSection.classList.remove("active")
})

modeText.addEventListener("click", () => {
  setInputMode("text")
})

modeFile.addEventListener("click", () => {
  setInputMode("file")
})

modeUrl.addEventListener("click", () => {
  setInputMode("url")
})

function setInputMode(mode) {
  ;[modeText, modeFile, modeUrl].forEach((btn) => btn.classList.remove("active"))
  ;[inputText, inputFile, inputUrl].forEach((div) => div.classList.add("hidden"))

  if (mode === "text") {
    modeText.classList.add("active")
    inputText.classList.remove("hidden")
    currentText = textInput.value
  } else if (mode === "file") {
    modeFile.classList.add("active")
    inputFile.classList.remove("hidden")
  } else if (mode === "url") {
    modeUrl.classList.add("active")
    inputUrl.classList.remove("hidden")
  }
}

textInput.addEventListener("input", (e) => {
  currentText = e.target.value
})

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      currentText = event.target.result
      textInput.value = currentText
    }
    reader.readAsText(file)
  }
})

loadUrlButton.addEventListener("click", async () => {
  const url = urlInput.value.trim()
  if (!url) {
    alert("Por favor ingresa una URL válida")
    return
  }

  try {
    loadUrlButton.textContent = "Cargando..."
    loadUrlButton.disabled = true

    const response = await fetch(url)
    if (!response.ok) throw new Error("Error al cargar la URL")

    currentText = await response.text()
    textInput.value = currentText

    loadUrlButton.textContent = "Cargar desde URL"
    loadUrlButton.disabled = false

    alert("Texto cargado exitosamente")
  } catch (error) {
    alert("Error al cargar el texto desde la URL: " + error.message)
    loadUrlButton.textContent = "Cargar desde URL"
    loadUrlButton.disabled = false
  }
})

searchButton.addEventListener("click", () => {
  const pattern = regexInput.value.trim()

  if (!pattern) {
    alert("Por favor ingresa una expresión regular")
    return
  }

  if (!currentText) {
    alert("Por favor ingresa o carga un texto")
    return
  }

  try {
    let flags = ""
    if (flagI.checked) flags += "i"
    if (flagG.checked) flags += "g"
    if (flagM.checked) flags += "m"

    const regex = new RegExp(pattern, flags)
    const lines = currentText.split("\n")
    const matches = []

    lines.forEach((line, index) => {
      const lineMatches = [...line.matchAll(new RegExp(pattern, flags))]
      lineMatches.forEach((match) => {
        matches.push({
          text: match[0],
          line: index + 1,
          position: match.index,
          fullLine: line,
        })
      })
    })

    displayResults(matches)
  } catch (error) {
    alert("Error en la expresión regular: " + error.message)
  }
})

function displayResults(matches) {
  resultsDiv.innerHTML = ""

  if (matches.length === 0) {
    resultsDiv.innerHTML = '<div class="text-center text-zinc-400 py-8">No se encontraron coincidencias</div>'
    statsDiv.classList.add("hidden")
    return
  }

  const uniqueLines = new Set(matches.map((m) => m.line))
  matchCount.textContent = matches.length
  lineCount.textContent = uniqueLines.size
  statsDiv.classList.remove("hidden")

  matches.forEach((match, index) => {
    const resultItem = document.createElement("div")
    resultItem.className = "result-item"

    const highlightedLine = match.fullLine.replace(
      new RegExp(escapeRegex(match.text), "g"),
      `<span class="highlight">${match.text}</span>`,
    )

    resultItem.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold text-cyan-400">Coincidencia ${index + 1}</span>
                <span class="text-xs text-zinc-500">Línea ${match.line} : Posición ${match.position}</span>
            </div>
            <div class="font-mono text-sm text-zinc-300 break-all">${highlightedLine}</div>
        `

    resultsDiv.appendChild(resultItem)
  })
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const grammars = {
  password: {
    description:
      "Genera contraseñas seguras con mayúsculas, minúsculas, números y símbolos especiales (8-16 caracteres)",
    generate: () => {
      const length = Math.floor(Math.random() * 9) + 8
      const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const lower = "abcdefghijklmnopqrstuvwxyz"
      const numbers = "0123456789"
      const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
      const all = upper + lower + numbers + symbols

      let password = ""
      password += upper[Math.floor(Math.random() * upper.length)]
      password += lower[Math.floor(Math.random() * lower.length)]
      password += numbers[Math.floor(Math.random() * numbers.length)]
      password += symbols[Math.floor(Math.random() * symbols.length)]

      for (let i = password.length; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)]
      }

      return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
    },
  },
  email: {
    description: "Genera direcciones de correo electrónico con nombres y dominios aleatorios",
    generate: () => {
      const names = ["juan", "maria", "carlos", "ana", "pedro", "lucia", "diego", "sofia", "miguel", "laura"]
      const surnames = ["garcia", "rodriguez", "martinez", "lopez", "gonzalez", "perez", "sanchez", "ramirez"]
      const domains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "empresa.com", "correo.com"]

      const name = names[Math.floor(Math.random() * names.length)]
      const surname = surnames[Math.floor(Math.random() * surnames.length)]
      const domain = domains[Math.floor(Math.random() * domains.length)]
      const separator = Math.random() > 0.5 ? "." : "_"
      const number = Math.random() > 0.6 ? Math.floor(Math.random() * 999) : ""

      return `${name}${separator}${surname}${number}@${domain}`
    },
  },
  address: {
    description: "Genera direcciones físicas completas con calle, número, ciudad y código postal",
    generate: () => {
      const streets = [
        "Av. Principal",
        "Calle Mayor",
        "Paseo Central",
        "Av. Libertad",
        "Calle Real",
        "Av. Independencia",
      ]
      const cities = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Bilbao"]
      const number = Math.floor(Math.random() * 500) + 1
      const floor = Math.random() > 0.5 ? `, ${Math.floor(Math.random() * 10) + 1}º` : ""
      const postal = Math.floor(Math.random() * 90000) + 10000

      const street = streets[Math.floor(Math.random() * streets.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]

      return `${street} ${number}${floor}, ${postal} ${city}`
    },
  },
  phone: {
    description: "Genera números de teléfono en formato internacional y local",
    generate: () => {
      const countryCode = ["+34", "+52", "+54", "+56", "+57"][Math.floor(Math.random() * 5)]
      const areaCode = Math.floor(Math.random() * 900) + 100
      const firstPart = Math.floor(Math.random() * 900) + 100
      const secondPart = Math.floor(Math.random() * 9000) + 1000

      return `${countryCode} ${areaCode} ${firstPart} ${secondPart}`
    },
  },
  username: {
    description: "Genera nombres de usuario únicos con combinaciones de palabras y números",
    generate: () => {
      const adjectives = ["cool", "super", "mega", "ultra", "pro", "master", "epic", "dark", "shadow", "fire"]
      const nouns = ["gamer", "coder", "ninja", "dragon", "wolf", "tiger", "eagle", "phoenix", "warrior", "legend"]
      const number = Math.floor(Math.random() * 9999)

      const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
      const noun = nouns[Math.floor(Math.random() * nouns.length)]

      return `${adj}_${noun}${number}`
    },
  },
  url: {
    description: "Genera URLs completas con protocolo, dominio y rutas",
    generate: () => {
      const protocols = ["https://"]
      const subdomains = ["www", "app", "api", "blog", "shop", "portal"]
      const domains = ["ejemplo", "sitio", "pagina", "web", "portal", "empresa"]
      const tlds = [".com", ".es", ".net", ".org", ".io"]
      const paths = ["/inicio", "/productos", "/servicios", "/contacto", "/blog", "/acerca-de"]

      const protocol = protocols[0]
      const subdomain = Math.random() > 0.3 ? subdomains[Math.floor(Math.random() * subdomains.length)] + "." : ""
      const domain = domains[Math.floor(Math.random() * domains.length)]
      const tld = tlds[Math.floor(Math.random() * tlds.length)]
      const path = Math.random() > 0.4 ? paths[Math.floor(Math.random() * paths.length)] : ""

      return `${protocol}${subdomain}${domain}${tld}${path}`
    },
  },
  plate: {
    description: "Genera placas de vehículos en diferentes formatos (europeo y americano)",
    generate: () => {
      const formats = [
        () => {
          const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          const numbers = "0123456789"
          let plate = ""
          for (let i = 0; i < 4; i++) plate += numbers[Math.floor(Math.random() * numbers.length)]
          for (let i = 0; i < 3; i++) plate += letters[Math.floor(Math.random() * letters.length)]
          return plate
        },
        () => {
          const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          const numbers = "0123456789"
          let plate = ""
          for (let i = 0; i < 3; i++) plate += letters[Math.floor(Math.random() * letters.length)]
          plate += "-"
          for (let i = 0; i < 4; i++) plate += numbers[Math.floor(Math.random() * numbers.length)]
          return plate
        },
      ]

      return formats[Math.floor(Math.random() * formats.length)]()
    },
  },
}

function updateGrammarDescription() {
  const selected = grammarSelect.value
  grammarDescription.textContent = grammars[selected].description
}

grammarSelect.addEventListener("change", updateGrammarDescription)
updateGrammarDescription()

generateButton.addEventListener("click", () => {
  const selected = grammarSelect.value
  const count = Number.parseInt(generateCount.value)

  if (count < 1 || count > 50) {
    alert("La cantidad debe estar entre 1 y 50")
    return
  }

  const results = []
  for (let i = 0; i < count; i++) {
    results.push(grammars[selected].generate())
  }

  displayGeneratedResults(results)
})

function displayGeneratedResults(results) {
  generatedResults.innerHTML = ""
  copyAllButton.classList.remove("hidden")

  results.forEach((result, index) => {
    const item = document.createElement("div")
    item.className = "generated-item"

    item.innerHTML = `
            <span class="font-mono text-sm">${result}</span>
            <button class="copy-button" data-text="${result}">Copiar</button>
        `

    generatedResults.appendChild(item)
  })

  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const text = e.target.getAttribute("data-text")
      navigator.clipboard.writeText(text).then(() => {
        e.target.textContent = "Copiado!"
        e.target.classList.add("copied")
        setTimeout(() => {
          e.target.textContent = "Copiar"
          e.target.classList.remove("copied")
        }, 2000)
      })
    })
  })
}

copyAllButton.addEventListener("click", () => {
  const allText = Array.from(document.querySelectorAll(".generated-item span"))
    .map((span) => span.textContent)
    .join("\n")

  navigator.clipboard.writeText(allText).then(() => {
    const originalText = copyAllButton.textContent
    copyAllButton.textContent = "Copiado!"
    setTimeout(() => {
      copyAllButton.textContent = originalText
    }, 2000)
  })
})
