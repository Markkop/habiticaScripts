export const customSkills = [
    {
        name: 'Soul Pact',
        imgSrc: 'https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png',
        description: 'Sacrifices health and experience to recover 10% of your max mana',
        modifiers: [
            { resource: 'hp', factor: -20, type: 'max' },
            { resource: 'mp', factor: +10, type: 'max' },
            { resource: 'exp', factor: -40, type: 'max' },
        ],
    },
    {
        name: 'Midas Touch',
        imgSrc: 'http://pixeljoint.com/files/icons/goldbar.png',
        description: 'Transmutes 10 gold coins by consuming mana and experience',
        modifiers: [
            { resource: 'mp', factor: -25, type: 'max' },
            { resource: 'exp', factor: -20, type: 'max' },
            { resource: 'gp', factor: +10, type: 'flat' },
        ],
    },
    {
        name: 'Time Rewind',
        imgSrc:
            'https://www.pngix.com/pngfile/middle/185-1857051_stopwatch-comments-delay-clipart-transparent-hd-png-download.png',
        description:
            'Sends you back in time some moments ago consuming all your current experience and restoring 10% of your max health',
        modifiers: [
            { resource: 'hp', factor: +10, type: 'max' },
            { resource: 'mp', factor: -70, type: 'max' },
            { resource: 'exp', factor: -100, type: 'current' },
        ],
    },
    {
        name: 'Throw a Coin',
        imgSrc: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/water-fountain-1840249-1560151.png',
        description: 'Try your luck by throwing a coin in the fountain.',
        modifiers: [
            { resource: 'gp', factor: -5, type: 'flat' },
            { resource: 'mp', factor: +10, type: 'random' },
            { resource: 'hp', factor: +5, type: 'random' },
        ],
    },
]
