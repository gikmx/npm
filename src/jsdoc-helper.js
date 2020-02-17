/**
 * @module helper
 * @memberof gik.Scripts.docs
 * @private
 */

/**
 * @memberof gik.Scripts.docs.helper
 * @description Generates an index according to node inheritance.
 * @param {Object} node - The node to analyze.
 * @returns {string[]} - The node's inheritance index.
 */
function nodeIndex(node) {
    let index;
    const { memberof, longname, name } = node;
    if (typeof memberof === 'string' && memberof.length && memberof.indexOf('module:') === -1) {
        index = [].concat(memberof, name);
    } else if (!longname.indexOf('module:') === -1) {
        return null;
    } else {
        index = longname.split('module:');
    }
    return index
        .reduce((acc, cur) => acc.concat(cur.split(/[.~]/)), [])
        .filter(Boolean);
}

/**
 * @typedef {Object} ParsedIndex
 * @memberof gik.Scripts.docs.helper
 * @description A readable version of a node's inheritance index.
 * @property {sTring} name - The name of the current index.
 * @property {string} parent - The name of current's node parent.
 */

/**
 * @memberof gik.Scripts.docs.helper
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
 * @memberof gik.Scripts.docs.helper
 * @description Returns all the memebers in given context, ordered by inheritance.
 * @param {number} level - The maximum index level to return.
 * @returns {Object[]} - An ordered array containing indexed nodes.
 */
function gMembers(level = null) {
    let nodes = [];
    this
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
                return nodes.push(node);
            }
            node.parent = nodes[parentIndex];
            if (node.parent.access) node.access = node.parent.access;
            if (!Array.isArray(node.parent.children)) {
                node.parent.children = [node];
            } else if (node.parent.children.map(child => child.id).indexOf(node.id) === -1) {
                // make sure the children is not there already
                node.parent.children.push(node);
            }
            // parent found,  append it.
            const offset = parentIndex + (node.parent.children.length || 1);
            return nodes.splice(offset, 0, node);
        });
    if (level) nodes = nodes.filter(node => node.index.length <= parseInt(level, 10));
    return nodes;
}

function gEach(...args) {
    if (args.length !== 1) throw new Error('gEach: invalid number of arguments.');
    const options = args.pop();
    const { priv } = options.hash;

    let nodes = this;
    if (!priv) nodes = nodes.filter(node => node.access !== 'private');
    return nodes
        .reduce((acc, node, index, arr) => (acc += options.fn(node, { // eslint-disable-line
            data: Object.assign(options.data, {
                index,
                first: index === 0,
                last: index === (arr.length - 1),
                level: Array(node.index.length - 1),
            }),
        })), '');
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

const newline = () => '\n';

const nop = markup => markup
    .replace(/^\s*<p>/, '')
    .replace(/<\/p>\s*$/, '');

module.exports = {
    gExamples,
    gEach,
    gSummary,
    gMembers,
    or,
    and,
    not,
    nop,
    newline,
};
