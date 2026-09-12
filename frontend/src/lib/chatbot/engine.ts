import { knowledgeBase, type KnowledgeChunk } from './knowledge'

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'and', 'or', 'but', 'if', 'then', 'else', 'for', 'of', 'to', 'in',
  'on', 'at', 'by', 'with', 'as', 'from', 'into', 'about', 'over',
  'do', 'does', 'did', 'doing', 'have', 'has', 'had', 'i', 'you',
  'we', 'they', 'he', 'she', 'it', 'me', 'us', 'them', 'my', 'your',
  'our', 'their', 'can', 'could', 'would', 'should', 'will', 'may',
  'might', 'please', 'tell', 'about', 'give', 'how', 'show',
])

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
}

const scoreChunk = (query: string, chunk: KnowledgeChunk): number => {
  const queryTokens = new Set(tokenize(query))
  if (queryTokens.size === 0) return 0

  const chunkText = (
    chunk.question +
    ' ' +
    chunk.keywords.join(' ') +
    ' ' +
    chunk.answer
  ).toLowerCase()

  let score = 0
  for (const token of queryTokens) {
    if (chunkText.includes(token)) {
      score += 1
      if (chunk.keywords.some((k) => k.includes(token))) {
        score += 1.5
      }
    }
  }
  return score / Math.sqrt(queryTokens.size)
}

export type ChatResult = {
  matched: boolean
  question?: string
  answer?: string
  category?: string
  suggestions: KnowledgeChunk[]
  actionButton?: KnowledgeChunk['actionButton']
}

export function askNakshatra(query: string): ChatResult {
  const ranked = knowledgeBase
    .map((chunk) => ({ chunk, score: scoreChunk(query, chunk) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  if (ranked.length === 0) {
    return {
      matched: false,
      suggestions: knowledgeBase.slice(0, 3),
    }
  }

  const top = ranked[0]
  const second = ranked[1]
  const topScore = top.score
  const secondScore = second ? second.score : 0

  // If two answers are very close, give a combined answer
  if (
    second &&
    topScore - secondScore < 0.6 &&
    top.chunk.category === second.chunk.category
  ) {
    return {
      matched: true,
      question: top.chunk.question + ' + ' + second.chunk.question,
      answer: `${top.chunk.answer}\n\n${second.chunk.answer}`,
      category: top.chunk.category,
      suggestions: ranked.slice(2, 5).map((r) => r.chunk),
      actionButton: top.chunk.actionButton || second.chunk.actionButton,
    }
  }

  return {
    matched: true,
    question: top.chunk.question,
    answer: top.chunk.answer,
    category: top.chunk.category,
    suggestions: ranked.slice(1, 4).map((r) => r.chunk),
    actionButton: top.chunk.actionButton,
  }
}
