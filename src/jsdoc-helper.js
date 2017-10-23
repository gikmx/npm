/**
 * @module helper
 * @memberof gik-npm.Scripts.docs
 * @private
 */

/**
 * @memberof gik-npm.Scripts.docs.helper
 * @description Returns the names of all the  nodes available in current context.
 * @param {Object} context - A context object to iterate.
 * @returns {string[]} - An array containing the availale types.
 */
function typeNames(context) {
    return context
        .map(node => node.kind)
        .filter((kind, i, arr) => arr.indexOf(kind) === i);
}

/**
 * @memberof gik-npm.Scripts.docs.helper
 * @description Returns jsdoc nodes of given type.
 * @param {Array} types - An array contaning the types you wish to filter in.
 * @param {Object} context - The context object to iterate.
 * @returns {Object[]} - An array of nodes.
 */
function typeNodes(types, context) {
    return types
        .map(kind => context
            .filter(node => node.kind === kind)
            .reduce((acc, cur) =>
                ({ [kind]: Array.isArray(acc[kind]) ? acc[kind].concat(cur) : [cur] }),
            {}),
        )
        .reduce((acc, cur) => Object.assign(acc, cur), {});
}

/**
 * @memberof gik-npm.Scripts.docs.helper
 * @description Generates an index according to node inheritance.
 * @param {Object} node - The node to analyze.
 * @returns {string[]} - The node's inheritance index.
 */
function nodeIndex(node) {
    let index;
    if (
        typeof node.memberof === 'string' &&
        node.memberof.length &&
        node.memberof.indexOf('module:') === -1
    ) index = []
        .concat(node.memberof, node.name);
    else if (!node.longname.indexOf('module:') === -1) return null;
    else index = node.longname.split('module:');
    return index
        .reduce((acc, cur) => acc.concat(cur.split(/[.~]/)), [])
        .filter(Boolean);
}

/**
 * @typedef {Object} ParsedIndex
 * @memberof gik-npm.Scripts.docs.helper
 * @description A readable version of a node's inheritance index.
 * @property {sTring} name - The name of the current index.
 * @property {string} parent - The name of current's node parent.
 */

/**
 * @memberof gik-npm.Scripts.docs.helper
 * @description Converts an inheritance index array to a more readable object.
 * @param {Object} node - The node containing the inheritance index.
 * @returns {npm.docs.helper.ParsedIndex} - An object containing info about the index.
 */
function nodeParseIndex(node) {
    return {
        id: node.index.join('.'),
        name: node.index[node.index.length - 1],
        parent: node.index.slice(0, -1).join('.') || null,
    };
}

/**
 * @memberof gik-npm.Scripts.docs.helper
 * @description Returns all the memebers in given context, ordered by inheritance.
 * @param {Object} context - The context to work against.
 * @returns {Object[]} - An ordered array containing indexed nodes.
 */
function members(context) {
    const nodes = [];
    context
        .map((node) => {
            node.index = nodeIndex(node);
            return Object.assign(node, nodeParseIndex(node));
        })
        .sort((a, b) => {
            if (a.index.length > b.index.length) return 1;
            if (a.index.length < b.index.length) return -1;
            // same length? let internal order decide
            if (a.order > b.order) return 1;
            if (a.order < b.order) return -1;
            return 0;
        })
        .forEach((node) => {
            // no parents? add it to the nodes
            if (!node.parent) return nodes.unshift({
                ...node,
                id: node.name,
                parent: null,
                children: [],
            });
            const parentIndex = nodes
                .map(result => result.id)
                .lastIndexOf(node.parent);
            // if no parent is found, create a dummy so this node isn't an orphan.
            if (parentIndex === -1) {
                nodes.push({
                    id: node.parent,
                    name: node.parent,
                    longname: node.parent,
                    index: node.parent.split('.'),
                    parent: null,
                    children: [],
                });
                return nodes.unshift(node);
            }
            node.parent = nodes[parentIndex];
            if (node.parent.access) node.access = node.parent.access;
            if (!Array.isArray(node.parent.children))
                node.parent.children = [node];
            // make sure the children is not there already
            else if (node.parent.children.map(child => child.id).indexOf(node.id) === -1)
                node.parent.children.unshift(node);
            // parent found,  append it.
            return nodes.splice(parentIndex + 1, 0, node);
        });
    return nodes;
}

function gEach(...args) {
    let index = 0;
    const options = args.pop();
    const privEnabled = args.shift();
    return members(this).reduce((output, node, i, arr) => {
        if (!privEnabled) {
            if (node.access === 'private') return output;
            // node can have children that are private. filter them out.
            if (node.children)
                node.children = node.children.filter(n => n.access !== 'private');
        }
        const first = index === 0;
        const last = index === arr.length - 1;
        let level = Array(node.index.length);
        if (level.length > 5) level = Array(5);
        output += options.fn(node, {
            data: {
                ...options.data,
                first,
                last,
                index,
                level,
            },
        });
        index++;
        return output;
    }, '');
}

function gExamples(...args) {
    const options = args.pop();
    if (!this.examples) return '';
    return this.examples.reduce((acc, cur) => {
        const lines = cur.split(/\r\n|\r|\n/);
        let caption = lines[0].match(/\s*<caption>(.+)<\/caption>/i);
        if (caption) caption = caption[1]; // eslint-disable-line
        let lang = lines[0].match(/\s*@lang\s+([^\s]+)/);
        if (lang) lang = lang[1]; // eslint-disable-line
        let example = lines.slice(1).join('\n').trim();
        if (!example.match(/^```[^`]+```$/m)) example = [
            `\`\`\`${lang || ''}`,
            example,
            '```',
        ].join('\n');
        return acc + options.fn({ caption, example });
    }, '');
}

function gSummary(...args) {
    args.pop();
    if (args.length !== 1) throw new Error('Summarize: invalid number of arguments');
    return String(args[0])
        .split(/\r\n|\r|\n/)
        .shift();
}

function or(...args) {
    args.pop(); // get rid of options.
    if (args.length !== 2) throw new Error('Or: invalid number of arguments');
    return args.filter(Boolean).length > 0;
}

function and(...args) {
    args.pop(); // get rid of options.
    if (args.length !== 2) throw new Error('And: invalid number of arguments');
    return args.filter(value => !value).length === 0;
}

function not(...args) {
    args.pop(); // get rid of options.
    if (args.length !== 1) throw new Error('Not: invalid number of arguments');
    return !args[0];
}

module.exports = {
    gExamples,
    gEach,
    gSummary,
    typeNames,
    typeNodes,
    or,
    and,
    not,
};
