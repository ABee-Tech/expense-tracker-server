import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Test} from '../models';
import {TestRepository} from '../repositories';

export class TestController {
  constructor(
    @repository(TestRepository)
    public testRepository : TestRepository,
  ) {}

  @post('/tests')
  @response(200, {
    description: 'Test model instance',
    content: {'application/json': {schema: getModelSchemaRef(Test)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, {
            title: 'NewTest',
            exclude: ['id'],
          }),
        },
      },
    })
    test: Omit<Test, 'id'>,
  ): Promise<Test> {
    return this.testRepository.create(test);
  }

  @get('/tests/count')
  @response(200, {
    description: 'Test model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Test) where?: Where<Test>,
  ): Promise<Count> {
    return this.testRepository.count(where);
  }

  @get('/tests')
  @response(200, {
    description: 'Array of Test model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Test, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Test) filter?: Filter<Test>,
  ): Promise<Test[]> {
    return this.testRepository.find(filter);
  }

  @patch('/tests')
  @response(200, {
    description: 'Test PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, {partial: true}),
        },
      },
    })
    test: Test,
    @param.where(Test) where?: Where<Test>,
  ): Promise<Count> {
    return this.testRepository.updateAll(test, where);
  }

  @get('/tests/{id}')
  @response(200, {
    description: 'Test model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Test, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Test, {exclude: 'where'}) filter?: FilterExcludingWhere<Test>
  ): Promise<Test> {
    return this.testRepository.findById(id, filter);
  }

  @patch('/tests/{id}')
  @response(204, {
    description: 'Test PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, {partial: true}),
        },
      },
    })
    test: Test,
  ): Promise<void> {
    await this.testRepository.updateById(id, test);
  }

  @put('/tests/{id}')
  @response(204, {
    description: 'Test PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() test: Test,
  ): Promise<void> {
    await this.testRepository.replaceById(id, test);
  }

  @del('/tests/{id}')
  @response(204, {
    description: 'Test DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.testRepository.deleteById(id);
  }
}
