import katex from 'katex'
import 'katex/dist/katex.min.css'

function renderLatex(latex) {
    try {
        return katex.renderToString(latex, {
            throwOnError: false,
            displayMode: latex.startsWith('$$') || latex.startsWith('\\['),
        })
    } catch (e) {
        console.error('Failed to render LaTeX:', latex, e)
        return latex
    }
}

function convertLinksToEmbeds(text) {
    const youtubeRegExp = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9\-_]+)/g
    let newText = text.replace(
        youtubeRegExp,
        '<div class="rounded-md" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
    )

    const imgurRegExp = /(?:https?:\/\/)?(?:www\.)?(?:i\.imgur\.com\/)([a-zA-Z0-9\-_]+)\.(jpg|png|gif|jpeg)/g
    newText = newText.replace(imgurRegExp, '<img class="rounded-lg mt-2 mb-2 w-1/3" src="https://i.imgur.com/$1.$2" alt="Imgur Image" />')

    // Inline LaTeX: `$...$` or `\( ... \)`
    const inlineLatexRegExp = /\$(.*?)\$|\\\((.*?)\\\)/g
    newText = newText.replace(inlineLatexRegExp, (_, p1, p2) => renderLatex(p1 || p2))

    // Block LaTeX: `$$...$$` or `\[ ... \]`
    const blockLatexRegExp = /\$\$(.*?)\$\$|\\\[(.*?)\\\]/gs
    newText = newText.replace(blockLatexRegExp, (_, p1, p2) => `<div class="katex-block">${renderLatex(p1 || p2)}</div>`)

    return newText
}

export const createMarkup = (htmlContent) => {
    const htmlWithEmbeds = convertLinksToEmbeds(htmlContent)
    return { __html: htmlWithEmbeds }
}
