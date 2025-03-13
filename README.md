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
  template: '<div>Hello from Vue!</div>'
})

// Use it in React
function App() {
  return (
    <VueInReact component={VueComponent} />
  )
}
```

### Using React Components in Vue

```tsx
import { createReactInVue } from 'vue-react-bridge'
import React from 'react'

// Create a React component
const ReactComponent = () => <div>Hello from React!</div>

// Create a Vue component that wraps the React component
const VueComponent = createReactInVue(ReactComponent)

// Use it in Vue
export default {
  components: {
    ReactComponent: VueComponent
  }
}
```

## API

### VueInReact

A React component that renders a Vue component.

Props:
- `component`: The Vue component to render
- `props`: Props to pass to the Vue component

### createReactInVue

A function that creates a Vue component wrapper for a React component.

Parameters:
- `ReactComponent`: The React component to wrap

Returns:
- A Vue component that renders the React component

## License

MIT 