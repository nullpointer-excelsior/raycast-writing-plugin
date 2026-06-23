
# Raycast writing plugin 

Extensión de Raycast con herramientas de texto potenciadas por inteligencia artificial. Corrige gramática, ortografía y resume texto usando OpenAI.

## Comandos

| Comando     | Descripción                        |
| ----------- | ---------------------------------- |
| `grammar`   | Corrige la gramática y ortografía  |
| `summarize` | Resume el texto ingresado          |

## Requisitos

- [Raycast](https://raycast.com) instalado
- Una clave de API de OpenAI ([crear clave](https://platform.openai.com/api-keys))

## Instalación

1. Abre Raycast → Extensiones → Buscar extensiones
2. Busca "Texting Heroes" e instálalo
3. Ve a Preferencias de la extensión y configura tu `openaiApiKey`

O desde terminal:

```bash
npm install -g @raycast/api
git clone https://github.com/nullpointer-excelsior/raycast-writing-plugin.git
cd raycast-writing-plugin
npm install
npm run dev
```

## Uso

1. Abre Raycast (`⌘ + Espacio`)
2. Escribe **grammar** o **summarize** y presiona Enter
3. Ingresa o pega el texto en el área de texto
4. Presiona `⌘ + Enter` para procesar
5. El resultado se mostrará en una vista detallada. Usa `⌘ + C` para copiarlo al portapapeles.

## Desarrollo

```bash
npm run dev       # Inicia modo desarrollo
npm run build     # Compila la extensión
npm run lint      # Ejecuta el linter
npm run fix-lint  # Corrige errores de lint automáticamente
```

## Stack

- [Raycast API](https://developers.raycast.com)
- [OpenAI Node SDK](https://github.com/openai/openai-node)
- TypeScript, React, ESLint, Prettier

## Licencia

MIT
