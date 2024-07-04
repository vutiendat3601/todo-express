import express, { Express } from 'express';
import supertest from 'supertest';
import { escape } from 'validator';
import initApp from '../../app/init-app';
import * as http from 'http';
import getRandomPort from '../../utils/random-port';

interface Task {
  name: string;
  startDate: string | null;
  endDate: string | null;
}

describe('POST /v1/tasks', () => {
  let app: http.Server;
  beforeAll(async () => {
    app = initApp(express(), getRandomPort())();

    const existedTasks: Task[] = [
      {
        name: 'Learn JavaScript',
        startDate: '2024-06-01',
        endDate: '2024-06-30',
      },
      {
        name: 'Take the Math exam',
        startDate: '2024-06-02',
        endDate: '2022-06-02',
      },
      { name: 'Go shopping', startDate: '2022-06-03', endDate: null },
      {
        name: 'Test Beat Buddy production',
        startDate: '2024-06-10',
        endDate: '2024-06-11',
      },
    ];
    for (const task of existedTasks) {
      await supertest(app).post(`/v1/tasks`).send(task);
    }
  });

  interface Input {
    id: number | string | null;
    name: string | null;
    startDate: string | null;
    endDate: string | null;
    expectedStatus: number;
  }

  const inputs: Input[] = [
    {
      id: null,
      name: 'Record video about NodeJs',
      startDate: null,
      endDate: null,
      expectedStatus: 201,
    },
    {
      id: null,
      name: '    ', // Empty string
      startDate: null,
      endDate: null,
      expectedStatus: 400,
    },
    {
      id: null,
      name: null, // Null string
      startDate: null,
      endDate: null,
      expectedStatus: 400,
    },
    {
      id: 1, // Learn JavaScript
      name: 'Record video about NodeJs',
      startDate: null,
      endDate: null,
      expectedStatus: 200,
    },
    {
      id: 2, // Take the Math exam
      name: 'Record video about NodeJs',
      startDate: null,
      endDate: null,
      expectedStatus: 200,
    },
    {
      id: 1000, // Not found
      name: 'Record video about NodeJs',
      startDate: null,
      endDate: null,
      expectedStatus: 404,
    },
    {
      id: 1,
      name: 'Learn JavaScript',
      startDate: null,
      endDate: '2024-07-02', // Missing the startDate
      expectedStatus: 400,
    },
    {
      id: null,
      name: 'Learn Kafka',
      startDate: '2024-07-03', // The endDate is less than the startDate
      endDate: '2024-07-02', // The endDate is less than the startDate
      expectedStatus: 400,
    },
    {
      id: null,
      name: '<script>alert("Hello")</script>',
      startDate: '2024-07-03', // The endDate is less than the startDate
      endDate: '2024-07-02', // The endDate is less than the startDate
      expectedStatus: 400,
    },
    {
      id: null,
      name: '<script>alert("Hello")</script>', // Check escape characters
      startDate: '2024-07-03',
      endDate: '2024-07-03',
      expectedStatus: 201,
    },
    {
      id: null,
      name: 'Buy coffee',
      startDate: '2024-07-03',
      endDate: null,
      expectedStatus: 201,
    },
  ];

  for (const { id, name, startDate, endDate, expectedStatus } of inputs) {
    it(`${
      id !== null ? `Update [id=${id}]` : `Create [name=${name}]`
    }, expectedStatus: ${expectedStatus}`, async () => {
      const response = await supertest(app)
        .post('/v1/tasks')
        .send({ id, name, startDate, endDate });
      expect(response.status).toEqual(expectedStatus);
      if (200 <= response.status && response.status < 300) {
        const uri = response.header.location || `/v1/tasks/${id}`;
        const taskDto = await supertest(app).get(uri);
        if (name !== null) {
          console.log(taskDto.body.name);
          expect(taskDto.body.name).toEqual(escape(name));
        }
      }
    });
  }
});

describe('GET /v1/tasks/:id', () => {
  let app: http.Server;
  beforeAll(async () => {
    app = initApp(express(), getRandomPort())();
    const existedTasks: Task[] = [
      {
        name: 'Learn JavaScript',
        startDate: '2024-06-01',
        endDate: '2024-06-30',
      },
      {
        name: 'Take the Math exam',
        startDate: '2024-06-02',
        endDate: '2022-06-02',
      },
      { name: 'Go shopping', startDate: '2022-06-03', endDate: null },
      {
        name: 'Test Beat Buddy production',
        startDate: '2024-06-10',
        endDate: '2024-06-11',
      },
    ];
    for (const task of existedTasks) {
      await supertest(app).post(`/v1/tasks`).send(task);
    }
  });

  afterAll(async () => {
    for (let i = 1; i <= 10; i++) {
      await supertest(app).delete(`/v1/tasks/${i}`);
    }
    app.close();
  });

  interface Input {
    id: number | string | null;
    expectedStatus: number;
  }

  const inputs: Input[] = [
    { id: 1, expectedStatus: 200 },
    { id: 2, expectedStatus: 200 },
    { id: '1', expectedStatus: 200 }, // String id{ id: '1', expectedStatus: 200 },
    { id: '-1', expectedStatus: 404 }, // String id
    { id: -1, expectedStatus: 404 }, // String id
    { id: 1000, expectedStatus: 404 }, // Not found
    { id: '0x', expectedStatus: 400 }, // Wrong id format
    { id: null, expectedStatus: 400 }, // Wrong id format
    { id: `<script>alert('get')</script>`, expectedStatus: 404 }, // Wrong id format, It has '/' so that match another route
    { id: `alert('get')`, expectedStatus: 400 }, // Wrong id format
    { id: 0, expectedStatus: 404 }, // Not found
  ];

  for (const { id, expectedStatus } of inputs) {
    it(`Get [id=${id}], expectedStatus: ${expectedStatus}`, async () => {
      const response = await supertest(app).get(`/v1/tasks/${id}`);
      expect(response.status).toEqual(expectedStatus);
    });
  }
});

describe('GET /v1/tasks', () => {
  let app: http.Server;

  beforeAll(async () => {
    app = initApp(express(), getRandomPort())();
    const existedTasks: Task[] = [
      {
        name: 'Learn JavaScript',
        startDate: '2024-06-01',
        endDate: '2024-06-30',
      },
      {
        name: 'Take the Math exam',
        startDate: '2024-06-02',
        endDate: '2022-06-02',
      },
      { name: 'Go shopping', startDate: '2022-06-03', endDate: null },
      {
        name: 'Test Beat Buddy production',
        startDate: '2024-06-10',
        endDate: '2024-06-11',
      },
      {
        name: 'Buy coffee',
        startDate: '2024-07-12',
        endDate: '2024-06-12',
      },
    ];
    for (const task of existedTasks) {
      await supertest(app).post(`/v1/tasks`).send(task);
    }
  });

  afterAll(async () => {
    for (let i = 1; i <= 10; i++) {
      await supertest(app).delete(`/v1/tasks/${i}`);
    }
    app.close();
  });

  interface Input {
    page: string | number | null;
    size: string | number | null;
    sort: string | null;
    expectedStatus: number;
  }
  const intputs: Input[] = [
    { page: 1, size: 10, sort: null, expectedStatus: 200 },
    { page: '1', size: 10, sort: null, expectedStatus: 200 }, // string 'page'
    { page: '1', size: 100, sort: '', expectedStatus: 200 }, // max 'size' is 100
    { page: null, size: 10, sort: '', expectedStatus: 400 }, // wrong 'page' format
    { page: 1, size: null, sort: '', expectedStatus: 400 }, // wrong 'size' format
    { page: '1', size: 101, sort: '', expectedStatus: 400 }, // exceed max 'size'
    { page: -1, size: 10, sort: '', expectedStatus: 400 }, // 'page' must be greater than 0 (1-based index)
    { page: 1, size: 10, sort: 'name:asc', expectedStatus: 200 },
    {
      page: 1,
      size: 10,
      sort: `<script>alert('test')</script>`,
      expectedStatus: 400,
    }, // wrong 'sort' format
    { page: 1, size: 10, sort: 'null', expectedStatus: 400 }, // wrong 'sort' format
    { page: 1, size: 10, sort: 'name:s', expectedStatus: 400 }, // wrong 'sort' format
  ];

  for (const { page, size, sort, expectedStatus } of intputs) {
    it(`Get [page=${page}, size=${size}, sort=${sort}], expectedStatus: ${expectedStatus}`, async () => {
      const sortQuery = sort ? `&sort=${sort}` : '';
      const response = await supertest(app).get(
        `/v1/tasks?page=${page}&size=${size}${sortQuery}`
      );
      expect(response.status).toEqual(expectedStatus);
    });
  }
});

describe('PATCH /v1/tasks/:id', () => {
  let app: http.Server;
  beforeAll(async () => {
    app = initApp(express(), getRandomPort())();
    const existedTasks: Task[] = [
      {
        name: 'Learn JavaScript',
        startDate: '2024-06-01',
        endDate: '2024-06-30',
      },
      {
        name: 'Take the Math exam',
        startDate: '2024-06-02',
        endDate: '2024-06-02',
      },
      { name: 'Go shopping', startDate: '2022-06-03', endDate: null },
      {
        name: 'Test Beat Buddy production',
        startDate: '2024-06-10',
        endDate: '2024-06-11',
      },
      {
        name: 'Buy coffee',
        startDate: '2024-06-12',
        endDate: '2024-06-12',
      },
    ];
    for (const task of existedTasks) {
      await supertest(app).post(`/v1/tasks`).send(task);
    }
  }, 10000);

  afterAll(async () => {
    for (let i = 1; i <= 10; i++) {
      await supertest(app).delete(`/v1/tasks/${i}`);
    }
    app.close();
  });

  interface Input {
    id: number | string | null;
    name: string | null;
    startDate: string | null;
    endDate: string | null;
    expectedStatus: number;
  }

  const inputs: Input[] = [
    {
      id: null, // Missing id
      name: 'Record video about NodeJs',
      startDate: null, // Don't update 'startDate'
      endDate: null, // Don't update 'endDate'
      expectedStatus: 400,
    },
    {
      id: 1, // Learn JavaScript
      name: '    ', // Empty string
      startDate: null,
      endDate: null,
      expectedStatus: 400,
    },
    {
      id: 1, // Learn JavaScript
      name: 'Record video about NodeJs',
      startDate: '2024-06-31', // Invalid between 'startDate' and 'endDate'
      endDate: null, // Current endDate is '2024-06-30'
      expectedStatus: 400,
    },
    // {
    //   id: 2, // Take the Math exam
    //   name: null, // Don't update 'name'
    //   startDate: null, // Current startDate is '2024-06-02'
    //   endDate: '2024-05-01', // Invalid between 'startDate' and 'endDate'
    //   expectedStatus: 400,
    // },
    {
      id: 1000, // Not found
      name: 'Record video about NodeJs',
      startDate: null,
      endDate: null,
      expectedStatus: 404,
    },
    // {
    //   id: 1,
    //   name: 'Learn JavaScript',
    //   startDate: null,
    //   endDate: '2024-07-02',
    //   expectedStatus: 200,
    // },
    {
      id: null,
      name: 'Learn Kafka',
      startDate: '2024-07-03', // The endDate is less than the startDate
      endDate: '2024-07-02', // The endDate is less than the startDate
      expectedStatus: 400,
    },
    {
      id: null,
      name: '<script>alert("Hello")</script>',
      startDate: '2024-07-03', // The endDate is less than the startDate
      endDate: '2024-07-02', // The endDate is less than the startDate
      expectedStatus: 400,
    },
    {
      id: null,
      name: '<script>alert("Hello")</script>', // Check escape characters
      startDate: '2024-07-03',
      endDate: '2024-07-03',
      expectedStatus: 400,
    },
    {
      id: null,
      name: 'Buy coffee',
      startDate: '2024-07-03',
      endDate: null,
      expectedStatus: 400,
    },
  ];

  for (const { id, name, startDate, endDate, expectedStatus } of inputs) {
    it(`[id=${id}, name=${name}, startDate=${startDate}, endDate=${endDate}], expectedStatus: ${expectedStatus}`, async () => {
      const response = await supertest(app)
        .patch(`/v1/tasks/${id}`)
        .send({ name, startDate, endDate });
      expect(response.status).toEqual(expectedStatus);
      if (200 <= response.status && response.status < 300) {
        const uri = response.header.location || `/v1/tasks/${id}`;
        const taskDto = await supertest(app).get(uri);
        if (name !== null) {
          console.log(taskDto.body.name);
          if (name) {
            expect(taskDto.body.name).toEqual(escape(name));
          }
          if (startDate) {
            expect(taskDto.body.startDate).toEqual(startDate);
          }
          if (endDate) {
            expect(taskDto.body.endDate).toEqual(endDate);
          }
        }
      }
    }, 10000);
  }
});

describe('DELETE /v1/tasks/:id', () => {
  let app: http.Server;
  beforeAll(async () => {
    app = initApp(express(), getRandomPort())();
    const existedTasks: Task[] = [
      {
        name: 'Learn JavaScript',
        startDate: '2024-06-01',
        endDate: '2024-06-30',
      },
      {
        name: 'Take the Math exam',
        startDate: '2024-06-02',
        endDate: '2024-06-02',
      },
      { name: 'Go shopping', startDate: '2022-06-03', endDate: null },
      {
        name: 'Test Beat Buddy production',
        startDate: '2024-06-10',
        endDate: '2024-06-11',
      },
    ];
    for (const task of existedTasks) {
      await supertest(app).post(`/v1/tasks`).send(task);
    }
  });

  afterAll(async () => {
    for (let i = 1; i <= 10; i++) {
      await supertest(app).delete(`/v1/tasks/${i}`);
    }
    app.close();
  });

  interface Input {
    id: number | string | null;
    expectedStatus: number;
  }

  const inputs: Input[] = [
    { id: '-1', expectedStatus: 404 }, // String id
    { id: -1, expectedStatus: 404 }, // String id
    { id: 1000, expectedStatus: 404 }, // Not found
    { id: '0x', expectedStatus: 400 }, // Wrong id format
    { id: null, expectedStatus: 400 }, // Wrong id format
    { id: `<script>alert('get')</script>`, expectedStatus: 404 }, // Wrong id format, It has '/' so that match another route
    { id: `alert('get')`, expectedStatus: 400 }, // Wrong id format
    { id: 0, expectedStatus: 404 }, // Not found
  ];

  for (const { id, expectedStatus } of inputs) {
    it(`Get [id=${id}], expectedStatus: ${expectedStatus}`, async () => {
      const response = await supertest(app).delete(`/v1/tasks/${id}`);
      expect(response.status).toEqual(expectedStatus);
    });
  }
});