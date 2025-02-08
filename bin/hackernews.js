#!/usr/bin/env node

const { program } = require('commander');
const HackNewsService = require('../src/HackNewsService');

program
    .name('hackernews')
    .description('CLI tool to scrape Hacker News top stories and newest posts')
    .version('0.0.5');

program
    .command('top')
    .description('Fetch top stories from Hacker News')
    .option('-p, --page <number>', 'Page number to fetch', '1')
    .action(async (options) => {
        const data = await HackNewsService.hNewsTopList({ p: options.page });
        console.log(JSON.stringify(data, null, 2));
    });

program
    .command('newest')
    .description('Fetch newest stories from Hacker News')
    .option('--nextPage <token>', 'Next page token for pagination')
    .option('--index <number>', 'Page index', '1')
    .action(async (options) => {
        const data = await HackNewsService.hNewsNewestList({ nextPage: options.nextPage, index: Number(options.index) });
        console.log(JSON.stringify(data, null, 2));
    });

program.parse(process.argv);
