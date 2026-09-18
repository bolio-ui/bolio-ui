module.exports = (plop) => {
  plop.setGenerator('component', {
    description:
      'Create a component in core/ (remember to export it in core/index.ts)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your component name?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../core/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'templates/Component.tsx.hbs'
      },
      {
        type: 'add',
        path: '../core/{{pascalCase name}}/index.ts',
        templateFile: 'templates/index.ts.hbs'
      },
      {
        type: 'add',
        path: '../core/{{pascalCase name}}/stories.tsx',
        templateFile: 'templates/stories.tsx.hbs'
      },
      {
        type: 'add',
        path: '../core/{{pascalCase name}}/__tests__/{{pascalCase name}}.test.tsx',
        templateFile: 'templates/test.tsx.hbs'
      }
    ]
  })
}
