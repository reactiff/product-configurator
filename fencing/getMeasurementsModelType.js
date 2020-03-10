const range = (min, max) => Array.from({length: max - min}).map((_, i) => i + min); 

export default () => {

    return {
        name: 'fencingMeasurements',
        fields: {
            perimeterOfFence: { type: 'string', options: range(10, 100), defaultValue: 10 },
            numberOfCorners: { type: 'string', options: range(1, 10), defaultValue: 4 },
            numberOfEnds: { type: 'string', options: range(1, 10), defaultValue: 4 },
            numberOfGates: { type: 'string', options: range(1, 10), defaultValue: 1 },
        }
    };
}