# Bridge

A library that provides seamless integration between Vue and React components.

## Installation

```bash
pnpm add vue-react-bridge
```

## Usage

### Using Vue Components in React

```tsx
import { VueInReact } from 'vue-react-bridge'
import { defineComponent } from 'vue'

// Create a Vue component
const VueComponent = defineComponent({
  props: {
    message: String,
    count: Number,
  },
  template: '<div>{{ message }} (Count: {{ count }})</div>',
})

// Use it in React
function App() {
  return (
    <VueInReact
      component={VueComponent}
      props={{
        message: 'Hello from Vue!',
        count: 42,
      }}
    />
  )
}
```

### Using React Components in Vue

#### Option API

```tsx
import { createReactInVue } from 'vue-react-bridge'
import React from 'react'

// Create a React component
const ReactComponent = ({ message, count }) => (
  <div>
    {message} (Count: {count})
  </div>
)

// Create a Vue component that wraps the React component
const VueComponent = createReactInVue(ReactComponent)

// Use it in Vue
export default {
  components: {
    ReactComponent: VueComponent,
  },
  template: `
    <ReactComponent 
      :message="'Hello from React!'"
      :count="42"
    />
  `,
}
```

#### Composition API (Setup)

```tsx
import { createReactInVue } from 'vue-react-bridge'
import React from 'react'
import { defineComponent } from 'vue'

// Create a React component
const ReactComponent = ({ message, count }) => (
  <div>
    {message} (Count: {count})
  </div>
)

// Use it in Vue 3 setup
export default defineComponent({
  setup() {
    const ReactWrapper = createReactInVue(ReactComponent)

    return () => <ReactWrapper message="Hello from React!" count={42} />
  },
})
```

## API

### VueInReact

A React component that renders a Vue component.

Props:

- `component`: The Vue component to render
- `props`: Props to pass to the Vue component
  - Type: `Record<string, any>`
  - Description: An object containing all props to be passed to the Vue component
  - Example: `{ message: "Hello", count: 42 }`
- `on`: Event handlers for Vue component events
  - Type: `Record<string, Function>`
  - Description: An object containing event handlers for Vue component events
  - Example: `{ click: () => console.log('clicked') }`
- `ref`: React ref for the Vue component instance
  - Type: `Ref<ComponentPublicInstance | null>`
  - Description: A ref to access the Vue component instance
  - Example: `const vueRef = useRef(null)`

### createReactInVue

A function that creates a Vue component wrapper for a React component.

Parameters:

- `ReactComponent`: The React component to wrap
  - Type: `ComponentType<any>`
  - Description: The React component to be wrapped

Returns:

- A Vue component that renders the React component

Props:

- All props passed to the Vue component will be forwarded to the React component
- Props are automatically converted from Vue's camelCase to React's camelCase
- Event handlers are automatically converted from Vue's `@event` to React's `onEvent`

## License

MIT
