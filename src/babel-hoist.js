const MOKAMOK = { name: 'mokamok' };


function shouldHoistExpression(expr) {
    if (!expr.isCallExpression()) {
        return false;
    }

    const callee = expr.get('callee');
    const object = callee.get('object');
    const property = callee.get('property');
    return (property.isIdentifier() &&
        (property.node.name === 'mock' ||
            property.node.name === 'unmock' ||
            property.node.name === 'forceReload') &&
        object.isIdentifier(MOKAMOK));
};


export default function () {
    return {
        visitor: {
            ExpressionStatement(path) {
                if (shouldHoistExpression(path.get('expression'))) {
                    path.node._blockHoist = Infinity;
                }
            },
        },
    };
};

// TODO: make it safer (it's too easy to access unhoisted code from the mocks)
