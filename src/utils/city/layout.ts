import type { CityNode, ProcessedNodeData, LayoutResult } from '@/types/city'
import { SPACING, BUILDING_HEIGHT_SCALE, BUILDING_WIDTH_SCALE, PLATFORM_HEIGHT, AREA_BUFFER } from './constants'

// ========== LAYOUT I PRZETWARZANIE ==========
export function layoutInRows(children: ProcessedNodeData[]): LayoutResult {
    let totalArea = 0;
    children.forEach(child => {
        totalArea += (child.width + SPACING) * (child.depth + SPACING);
    });
    
    const targetWidth = Math.sqrt(totalArea * AREA_BUFFER);
    const rows: Array<Array<{ child: ProcessedNodeData; index: number }>> = [];
    let currentRow: Array<{ child: ProcessedNodeData; index: number }> = [];
    let currentRowWidth = SPACING;

    children.forEach((child, index) => {
        const childWidth = child.width + SPACING;
        
        if (currentRowWidth + childWidth > targetWidth && currentRow.length > 0) {
            rows.push(currentRow);
            currentRow = [{ child, index }];
            currentRowWidth = SPACING + childWidth;
        } else {
            currentRow.push({ child, index });
            currentRowWidth += childWidth;
        }
    });

    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    const positions: Array<{ x: number; z: number; rowDepth: number }> = [];
    let totalDepth = SPACING;
    let maxWidth = 0;

    rows.forEach(row => {
        let rowWidth = SPACING;
        let maxRowDepth = 0;

        row.forEach(({ child }) => {
            maxRowDepth = Math.max(maxRowDepth, child.depth);
        });

        row.forEach(({ child, index }) => {
            positions[index] = {
                x: rowWidth + child.width / 2,
                z: totalDepth + child.depth / 2,
                rowDepth: maxRowDepth
            };
            rowWidth += child.width + SPACING;
        });

        maxWidth = Math.max(maxWidth, rowWidth);
        totalDepth += maxRowDepth + SPACING;
    });

    return { positions, totalWidth: maxWidth, totalDepth };
}

export function processNode(node: CityNode): ProcessedNodeData {
    const result: ProcessedNodeData = {
        width: 0,
        depth: 0,
        height: 0,
        children: [] as ProcessedNodeData[],
        positions: [] as Array<{ x: number; z: number; rowDepth: number }>
    };

    // Jeśli to plik
    if (node.height !== undefined && node.width !== undefined) {
        const width = node.width * BUILDING_WIDTH_SCALE;
        const depth = width;
        const height = node.height * BUILDING_HEIGHT_SCALE;
        
        return { 
            width, 
            depth, 
            height,
            children: [],
            positions: []
        };
    }

    // Jeśli to folder
    if (node.children && node.children.length > 0) {
        const processedChildren = node.children.map(child => processNode(child));
        result.children = processedChildren;

        // Sortuj dzieci po szerokości i wysokości
        const sortedIndices = processedChildren
            .map((child, index) => ({ child, index }))
            .sort((a, b) => {
                if (b.child.width !== a.child.width) {
                    return b.child.width - a.child.width;
                }
                return b.child.height - a.child.height;
            });

        const sortedChildren = sortedIndices.map(item => item.child);
        const originalIndices = sortedIndices.map(item => item.index);
        
        const layout = layoutInRows(sortedChildren);
        
        result.positions = new Array(processedChildren.length);
        layout.positions.forEach((pos, sortedIdx) => {
            result.positions[originalIndices[sortedIdx]] = pos;
        });
        
        result.width = layout.totalWidth;
        result.depth = layout.totalDepth;
        result.height = PLATFORM_HEIGHT;
    } else if (node.children !== undefined) {
        // Pusty folder - ustalony rozmiar
        result.width = 5;
        result.depth = 5;
        result.height = PLATFORM_HEIGHT;
    }

    return result;
}