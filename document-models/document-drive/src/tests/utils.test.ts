import { utils, DocumentDriveState, CopyNodeInput } from '../..';

const baseNodes: DocumentDriveState['nodes'] = [
    {
        id: '1',
        name: 'Folder 1',
        parentFolder: null,
        kind: 'folder',
    },
    {
        id: '1.1',
        name: 'Folder 1.1',
        parentFolder: '1',
        kind: 'folder',
    },
    {
        id: '1.1.1',
        name: 'Folder 1.1.1',
        parentFolder: '1.1',
        kind: 'folder',
    },
    {
        id: '2',
        name: 'Folder 2',
        parentFolder: null,
        kind: 'folder',
    },
    {
        id: '3',
        name: 'Folder 3',
        parentFolder: null,
        kind: 'folder',
    },
];

const generateId = (id: string) => `${id}-copy`;

describe('DocumentDrive Utils', () => {
    let nodes: DocumentDriveState['nodes'];

    beforeEach(() => {
        nodes = [...baseNodes];
    });

    describe('generateNodesCopy', () => {
        it('should return a copy of the affected nodes (subfolders and files) with new id', () => {
            const expectedResult: CopyNodeInput[] = [
                {
                    srcId: '1',
                    targetId: '1-copy',
                    targetName: 'Folder 1',
                    targetParentFolder: null,
                },
                {
                    srcId: '1.1',
                    targetId: '1.1-copy',
                    targetName: 'Folder 1.1',
                    targetParentFolder: '1-copy',
                },
                {
                    srcId: '1.1.1',
                    targetId: '1.1.1-copy',
                    targetName: 'Folder 1.1.1',
                    targetParentFolder: '1.1-copy',
                },
            ];

            const result = utils.generateNodesCopy(
                { srcId: '1' },
                generateId,
                nodes,
            );

            expect(result.length).toBe(3);
            expect(result).toEqual(expectedResult);
        });

        it('should return a copy of the affected nodes (subfolders and files) with new id and new name for the target node', () => {
            const expectedResult: CopyNodeInput[] = [
                {
                    srcId: '1',
                    targetId: '1-copy',
                    targetName: 'New Name',
                    targetParentFolder: null,
                },
                {
                    srcId: '1.1',
                    targetId: '1.1-copy',
                    targetName: 'Folder 1.1',
                    targetParentFolder: '1-copy',
                },
                {
                    srcId: '1.1.1',
                    targetId: '1.1.1-copy',
                    targetName: 'Folder 1.1.1',
                    targetParentFolder: '1.1-copy',
                },
            ];

            const result = utils.generateNodesCopy(
                { srcId: '1', targetName: 'New Name' },
                generateId,
                nodes,
            );

            expect(result.length).toBe(3);
            expect(result).toEqual(expectedResult);
        });

        it('should copy a single node inside another', () => {
            const expectedResult: CopyNodeInput[] = [
                {
                    srcId: '1.1.1',
                    targetId: '1.1.1-copy',
                    targetName: 'Folder 1.1.1',
                    targetParentFolder: '1.1',
                },
            ];

            const result = utils.generateNodesCopy(
                { srcId: '1.1.1', targetParentFolder: '1.1' },
                generateId,
                nodes,
            );

            expect(result.length).toBe(1);
            expect(result).toEqual(expectedResult);
        });

        it('should copy target and sub-nodes into a different node', () => {
            const expectedResult: CopyNodeInput[] = [
                {
                    srcId: '1',
                    targetId: '1-copy',
                    targetName: 'Folder 1',
                    targetParentFolder: '2',
                },
                {
                    srcId: '1.1',
                    targetId: '1.1-copy',
                    targetName: 'Folder 1.1',
                    targetParentFolder: '1-copy',
                },
                {
                    srcId: '1.1.1',
                    targetId: '1.1.1-copy',
                    targetName: 'Folder 1.1.1',
                    targetParentFolder: '1.1-copy',
                },
            ];

            const result = utils.generateNodesCopy(
                { srcId: '1', targetParentFolder: '2' },
                generateId,
                nodes,
            );

            expect(result.length).toBe(3);
            expect(result).toEqual(expectedResult);
        });

        it('should copy target and sub-nodes into a different node with a different name', () => {
            const expectedResult: CopyNodeInput[] = [
                {
                    srcId: '1',
                    targetId: '1-copy',
                    targetName: 'New Name',
                    targetParentFolder: '2',
                },
                {
                    srcId: '1.1',
                    targetId: '1.1-copy',
                    targetName: 'Folder 1.1',
                    targetParentFolder: '1-copy',
                },
                {
                    srcId: '1.1.1',
                    targetId: '1.1.1-copy',
                    targetName: 'Folder 1.1.1',
                    targetParentFolder: '1.1-copy',
                },
            ];

            const result = utils.generateNodesCopy(
                {
                    srcId: '1',
                    targetParentFolder: '2',
                    targetName: 'New Name',
                },
                generateId,
                nodes,
            );

            expect(result.length).toBe(3);
            expect(result).toEqual(expectedResult);
        });

        it('should throw an error if the src node is not found', () => {
            expect(() =>
                utils.generateNodesCopy(
                    { srcId: 'invalid' },
                    generateId,
                    nodes,
                ),
            ).toThrowError(`Node with id invalid not found`);
        });
    });
});
