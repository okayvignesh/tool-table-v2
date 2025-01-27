import { v4 as uuidv4 } from 'uuid';

export const regionData = [
  {
    id: uuidv4(),
    region: 'AMR',
    countries: [
      {
        id: uuidv4(),
        country: 'USA',
        marketTeams: [
          {
            id: uuidv4(),
            marketTeam: 'AMR Market Team 1',
            markets: [
              {
                id: uuidv4(),
                market: 'AMR Market 1',
                stores: [
                  { id: uuidv4(), name: 'AMR Store 1', selected: false },
                  { id: uuidv4(), name: 'AMR Store 2', selected: false },
                  { id: uuidv4(), name: 'AMR Store 3', selected: false },
                ],
              },
              {
                id: uuidv4(),
                market: 'AMR Market 2',
                stores: [
                  { id: uuidv4(), name: 'AMR Store 4', selected: false },
                  { id: uuidv4(), name: 'AMR Store 5', selected: false },
                  { id: uuidv4(), name: 'AMR Store 6', selected: false },
                ],
              },
            ],
          },
          {
            id: uuidv4(),
            marketTeam: 'AMR Market Team 2',
            markets: [
              {
                id: uuidv4(),
                market: 'AMR Market 3',
                stores: [
                  { id: uuidv4(), name: 'AMR Store 7', selected: false },
                  { id: uuidv4(), name: 'AMR Store 8', selected: false },
                  { id: uuidv4(), name: 'AMR Store 9', selected: false },
                ],
              },
              {
                id: uuidv4(),
                market: 'AMR Market 4',
                stores: [
                  { id: uuidv4(), name: 'AMR Store 10', selected: false },
                  { id: uuidv4(), name: 'AMR Store 11', selected: false },
                  { id: uuidv4(), name: 'AMR Store 12', selected: false },
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        country: 'Canada',
        marketTeams: [
          {
            id: uuidv4(),
            marketTeam: 'AMR Market Team 3',
            markets: [
              {
                id: uuidv4(),
                market: 'AMR Market 5',
                stores: [
                  { id: uuidv4(), name: 'AMR Store 13', selected: false },
                  { id: uuidv4(), name: 'AMR Store 14', selected: false },
                  { id: uuidv4(), name: 'AMR Store 15', selected: false },
                ],
              },
              {
                id: uuidv4(),
                market: 'AMR Market 6',
                stores: [
                  { id: uuidv4(), name: 'AMR Store 16', selected: false },
                  { id: uuidv4(), name: 'AMR Store 17', selected: false },
                  { id: uuidv4(), name: 'AMR Store 18', selected: false },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    region: 'EMEA',
    countries: [
      {
        id: uuidv4(),
        country: 'UK',
        marketTeams: [
          {
            id: uuidv4(),
            marketTeam: 'EMEA Market Team 1',
            markets: [
              {
                id: uuidv4(),
                market: 'EMEA Market 1',
                stores: [
                  { id: uuidv4(), name: 'EMEA Store 1', selected: false },
                  { id: uuidv4(), name: 'EMEA Store 2', selected: false },
                  { id: uuidv4(), name: 'EMEA Store 3', selected: false },
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        country: 'Germany',
        marketTeams: [
          {
            id: uuidv4(),
            marketTeam: 'EMEA Market Team 2',
            markets: [
              {
                id: uuidv4(),
                market: 'EMEA Market 2',
                stores: [
                  { id: uuidv4(), name: 'EMEA Store 4', selected: false },
                  { id: uuidv4(), name: 'EMEA Store 5', selected: false },
                  { id: uuidv4(), name: 'EMEA Store 6', selected: false },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    region: 'GC',
    countries: [
      {
        id: uuidv4(),
        country: 'China',
        marketTeams: [
          {
            id: uuidv4(),
            marketTeam: 'GC Market Team 1',
            markets: [
              {
                id: uuidv4(),
                market: 'GC Market 1',
                stores: [
                  { id: uuidv4(), name: 'GC Store 1', selected: false },
                  { id: uuidv4(), name: 'GC Store 2', selected: false },
                  { id: uuidv4(), name: 'GC Store 3', selected: false },
                ],
              },
              {
                id: uuidv4(),
                market: 'GC Market 2',
                stores: [
                  { id: uuidv4(), name: 'GC Store 4', selected: false },
                  { id: uuidv4(), name: 'GC Store 5', selected: false },
                  { id: uuidv4(), name: 'GC Store 6', selected: false },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    region: 'RPAC',
    countries: [
      {
        id: uuidv4(),
        country: 'India',
        marketTeams: [
          {
            id: uuidv4(),
            marketTeam: 'RPAC Market Team 1',
            markets: [
              {
                id: uuidv4(),
                market: 'RPAC Market 1',
                stores: [
                  { id: uuidv4(), name: 'RPAC Store 1', selected: false },
                  { id: uuidv4(), name: 'RPAC Store 2', selected: false },
                  { id: uuidv4(), name: 'RPAC Store 3', selected: false },
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        country: 'Japan',
        marketTeams: [
          {
            id: uuidv4(),
            marketTeam: 'RPAC Market Team 2',
            markets: [
              {
                id: uuidv4(),
                market: 'RPAC Market 2',
                stores: [
                  { id: uuidv4(), name: 'RPAC Store 4', selected: false },
                  { id: uuidv4(), name: 'RPAC Store 5', selected: false },
                  { id: uuidv4(), name: 'RPAC Store 6', selected: false },
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        country: 'Australia',
        marketTeams: [
          {
            id: uuidv4(),
            marketTeam: 'RPAC Market Team 3',
            markets: [
              {
                id: uuidv4(),
                market: 'RPAC Market 3',
                stores: [
                  { id: uuidv4(), name: 'RPAC Store 7', selected: false },
                  { id: uuidv4(), name: 'RPAC Store 8', selected: false },
                  { id: uuidv4(), name: 'RPAC Store 9', selected: false },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
