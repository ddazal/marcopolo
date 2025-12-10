import { OpenAIEmbeddingFunction } from "@chroma-core/openai";
import { ChromaClient, type Collection } from "chromadb";

const client = new ChromaClient()

export async function getCollection(name: string): Promise<Collection> {
    const collection = await client.getOrCreateCollection({
        name,
        embeddingFunction: new OpenAIEmbeddingFunction({
            modelName: "text-embedding-3-small",
        })
    });
    return collection
}