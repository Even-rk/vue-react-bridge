import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createRoot, Root } from 'react-dom/client'
import React from 'react'

/**
 * 创建一个包裹React组件的Vue组件
 *
 * @param ReactComponent 要包裹的React组件
 * @returns 一个渲染React组件的Vue组件
 */
export function createReactInVue(ReactComponent: React.ComponentType<any>) {
  // 如果提供的组件无效，记录警告
  if (!ReactComponent) {
    console.error('[ReactInVue] Invalid React component provided')
  }

  return defineComponent({
    name: 'ReactInVue',
    props: {
      // 将所有props转发给React组件
      props: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      // React组件的容器
      const containerRef = ref<HTMLElement | null>(null)
      // React根实例 - 存储为ref以正确维护响应式
      const reactRootRef = ref<Root | null>(null)
      // 错误状态
      const hasError = ref(false)
      const errorMessage = ref('')

      // 处理缺失React组件的情况
      if (!ReactComponent) {
        hasError.value = true
        errorMessage.value = 'Invalid React component provided'
      }

      // 初始React根并渲染组件
      onMounted(() => {
        // 如果已有错误或没有有效组件，则跳过
        if (hasError.value || !ReactComponent) return

        try {
          if (containerRef.value) {
            // 创建React根
            reactRootRef.value = createRoot(containerRef.value)
            // 初始渲染
            reactRootRef.value.render(React.createElement(ReactComponent, props.props))
          } else {
            throw new Error('React container element not found')
          }
        } catch (error) {
          hasError.value = true
          errorMessage.value = `Error initializing React component: ${
            error instanceof Error ? error.message : String(error)
          }`
          console.error('[ReactInVue] Error initializing React component:', error)
        }
      })

      // 当props变化时更新React组件
      watch(
        () => props.props,
        newProps => {
          // 如果没有有效组件，则跳过
          if (!ReactComponent || hasError.value) return

          try {
            if (reactRootRef.value && containerRef.value) {
              reactRootRef.value.render(React.createElement(ReactComponent, newProps))
            }
          } catch (error) {
            hasError.value = true
            errorMessage.value = `Error updating React component: ${
              error instanceof Error ? error.message : String(error)
            }`
            console.error('[ReactInVue] Error updating React component:', error)
          }
        },
        { deep: true }
      )

      // 在卸载时清理React根
      onBeforeUnmount(() => {
        try {
          if (reactRootRef.value) {
            reactRootRef.value.unmount()
            reactRootRef.value = null
          }
        } catch (error) {
          console.error('[ReactInVue] Error unmounting React component:', error)
        }
      })

      // 渲染函数
      return () => {
        if (hasError.value) {
          return h(
            'div',
            {
              style: {
                padding: '10px',
                border: '1px solid red',
                color: 'red',
                borderRadius: '4px',
              },
            },
            errorMessage.value || 'Error in React component'
          )
        }
        return h('div', { ref: containerRef })
      }
    },
  })
}
