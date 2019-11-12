module.exports = [
  'http://localhost:1234/mock-login?token=judgeArmen&path=/',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/search',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/search/no-matches',
  {
    actions: [
      'wait for #advanced-search-button to be visible',
      'click element #advanced-search-button',
      'wait for .search-result to be visible',
    ],
    notes: 'checks a11y of advanced search results table',
    url:
      'http://localhost:1234/mock-login?token=judgeArmen&path=/search?petitionerName=cairo',
  },
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-sessions',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-sessions',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc&info=calendared-case',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
];