module.exports = (plop) => {
  function generateEntityConfig() {
    const srcFolder = '../src';
    //TODO add create usecase
    const useCases = ['get', 'list', 'delete', 'update'];

    return {
      description: 'Generate a new entity',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Enter the entity name',
        },
      ],
      actions: () => {
        actions = [
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/application/dtos/{{dashCase name}}-output.ts`,
            templateFile: 'templates/entity/application/dtos/output.ts.hbs',
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/application/dtos/__tests__/unit/{{dashCase name}}-output.spec.ts`,
            templateFile:
              'templates/entity/application/dtos/output-test.ts.hbs',
          },
        ];

        useCases.forEach((useCase) => {
          actions.push(
            {
              type: 'add',
              path: `${srcFolder}/{{dashCase name}}/application/usecases/${useCase}-{{dashCase name}}.usecase.ts`,
              templateFile: `templates/entity/application/usecase/${useCase}-usecase/${useCase}-usecase.ts.hbs`,
            },
            {
              type: 'add',
              path: `${srcFolder}/{{dashCase name}}/application/usecases/__tests__/integration/${useCase}-{{dashCase name}}.usecase.int-spec.ts`,
              templateFile: `templates/entity/application/usecase/${useCase}-usecase/${useCase}-usecase-int-test.ts.hbs`,
            },
            {
              type: 'add',
              path: `${srcFolder}/{{dashCase name}}/application/usecases/__tests__/unit/${useCase}-{{dashCase name}}.usecase.spec.ts`,
              templateFile: `templates/entity/application/usecase/${useCase}-usecase/${useCase}-usecase-test.ts.hbs`,
            },
          );
        });

        // Entities
        actions.push(
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/entities/{{dashCase name}}.entity.ts`,
            templateFile: `templates/entity/domain/entities/entity.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/entities/__tests__/unit/{{dashCase name}}.entity.spec.ts`,
            templateFile: `templates/entity/domain/entities/entity-test.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/entities/__tests__/integration/{{dashCase name}}.entity.int-spec.ts`,
            templateFile: `templates/entity/domain/entities/entity-int-test.ts.hbs`,
          },
        );

        // Validators
        actions.push(
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/validators/{{dashCase name}}.validator.ts`,
            templateFile: `templates/entity/domain/validators/entity.validator.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/validators/__tests__/unit/{{dashCase name}}.validator.spec.ts`,
            templateFile: `templates/entity/domain/validators/entity.validator.spec.ts.hbs`,
          },
        );

        //DataBuilder and FakeBuilder
        actions.push(
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/testing/helper/{{dashCase name}}-data-builder.ts`,
            templateFile: `templates/entity/domain/testing/helper/entity-data-builder.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/fake-builder/{{dashCase name}}-fake.builder.ts`,
            templateFile: `templates/entity/domain/fake-builder/entity-fake.builder.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/fake-builder/__tests__/unit/{{dashCase name}}-fake.builder.spec.ts`,
            templateFile: `templates/entity/domain/fake-builder/entity-fake.builder.spec.ts.hbs`,
          },
        );

        //Repositories
        actions.push(
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/repositories/{{dashCase name}}.repository.ts`,
            templateFile: `templates/entity/domain/repositories/repository.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/domain/repositories/__tests__/integration/{{dashCase name}}.repository.int-spec.ts`,
            templateFile: `templates/entity/domain/repositories/repository-int-test.ts.hbs`,
          },
        );

        //Controller
        actions.push(
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/{{dashCase name}}.controller.ts`,
            templateFile: `templates/entity/infrastructure/controller.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/__tests__/unit/{{dashCase name}}.controller.spec.ts`,
            templateFile: `templates/entity/infrastructure/controller.spec.ts.hbs`,
          },
        );

        //Module
        actions.push({
          type: 'add',
          path: `${srcFolder}/{{dashCase name}}/infrastructure/{{dashCase name}}.module.ts`,
          templateFile: `templates/entity/infrastructure/module.ts.hbs`,
        });

        //Presenter
        actions.push(
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/presenters/{{dashCase name}}.presenter.ts`,
            templateFile: `templates/entity/infrastructure/presenters/presenter.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/presenters/__tests__/unit/{{dashCase name}}.presenter.spec.ts`,
            templateFile: `templates/entity/infrastructure/presenters/presenter-test.ts.hbs`,
          },
        );

        //Presenter
        actions.push(
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/dtos/list-{{dashCase name}}.dto.ts`,
            templateFile: `templates/entity/infrastructure/dtos/list.dto.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/dtos/update-{{dashCase name}}.dto.ts`,
            templateFile: `templates/entity/infrastructure/dtos/update.dto.ts.hbs`,
          },
        );

        //Database
        actions.push(
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/database/in-memory/repositories/{{dashCase name}}-in-memory.repository.ts`,
            templateFile: `templates/entity/infrastructure/database/in-memory/repositories/in-memory.repository.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/database/in-memory/repositories/__tests__/unit/{{dashCase name}}-in-memory.repository.spec.ts`,
            templateFile: `templates/entity/infrastructure/database/in-memory/repositories/in-memory.repository-test.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/database/prisma/repositories/{{dashCase name}}-prisma.repository.ts`,
            templateFile: `templates/entity/infrastructure/database/prisma/repositories/prisma.repository.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/database/prisma/models/{{dashCase name}}-model.mapper.ts`,
            templateFile: `templates/entity/infrastructure/database/prisma/models/model.mapper.ts.hbs`,
          },
          {
            type: 'add',
            path: `${srcFolder}/{{dashCase name}}/infrastructure/database/prisma/models/__tests__/integration/{{dashCase name}}-model.mapper.spec.ts`,
            templateFile: `templates/entity/infrastructure/database/prisma/models/model.mapper-int-test.ts.hbs`,
          },
        );

        //Erros
        actions.push({
          type: 'add',
          path: `${srcFolder}/{{dashCase name}}/infrastructure/errors/{{dashCase name}}-with-id-not-found-error.ts`,
          templateFile: `templates/entity/infrastructure/errors/entity-with-id-not-found-error.ts.hbs`,
        });

        return actions;
      },
    };
  }
  plop.setGenerator('entity', generateEntityConfig());
};
