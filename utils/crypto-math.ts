
export interface Point {
    x: number;
    y: number;
    label?: string;
    color?: string;
    size?: number;
    labelDx?: number;
    labelDy?: number;
}

export const calculateY = (x: number, a: number, b: number) => {
  const val = x * x * x + a * x + b;
  if (val < 0) return NaN;
  return Math.sqrt(val);
};

export const addPoints = (p1: Point | null, p2: Point | null, a: number): Point | null => {
    if (!p1) return p2;
    if (!p2) return p1;
    
    let m;
    // Doubling
    if (Math.abs(p1.x - p2.x) < 0.001 && Math.abs(p1.y - p2.y) < 0.001) {
        if (p1.y === 0) return null; 
        m = (3 * p1.x * p1.x + a) / (2 * p1.y);
    } else {
        // Addition
        if (Math.abs(p1.x - p2.x) < 0.001) return null; 
        m = (p2.y - p1.y) / (p2.x - p1.x);
    }
    
    const x3 = m * m - p1.x - p2.x;
    const y3 = m * (p1.x - x3) - p1.y;
    return { x: x3, y: y3 };
};

export const scalarMult = (k: number, startP: Point, a: number) => {
    let current: Point | null = startP;
    for (let i = 1; i < k; i++) {
        const next: Point | null = addPoints(current, startP, a);
        if (!next) break; // infinity
        current = next;
    }
    return current;
};

export const computeSHA256 = async (message: string) => {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
        // Fallback for non-secure contexts or simple demo purposes if needed
        return { hex: "Error: Secure context required", binary: "" };
    }
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    let binary = "";
    for (let i = 0; i < hashHex.length; i++) {
        binary += parseInt(hashHex[i], 16).toString(2).padStart(4, '0');
    }
    return { hex: hashHex, binary: binary };
};

// --- Merkle Tree Helpers ---

export const pairAndHash = async (hashes: string[]): Promise<string[]> => {
    const nextLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = i + 1 < hashes.length ? hashes[i + 1] : left; // Duplicate last if odd
        const combined = left + right;
        const res = await computeSHA256(combined);
        nextLevel.push(res.hex);
    }
    return nextLevel;
};

export const computeMerkleRoot = async (txHashes: string[]): Promise<string> => {
    if (txHashes.length === 0) return "";
    let currentLevel = [...txHashes];
    while (currentLevel.length > 1) {
        currentLevel = await pairAndHash(currentLevel);
    }
    return currentLevel[0];
};

export const computeMerkleTree = async (txHashes: string[]): Promise<string[][]> => {
    if (txHashes.length === 0) return [];
    const tree: string[][] = [txHashes];
    let currentLevel = [...txHashes];
    while (currentLevel.length > 1) {
        currentLevel = await pairAndHash(currentLevel);
        tree.push(currentLevel);
    }
    return tree;
};
