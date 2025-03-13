import React, { useRef, useEffect, useState } from 'react'
import { createApp, defineComponent, h } from 'vue'
import type { Component as VueComponent } from 'vue'

interface VueInReactProps {
  component: VueComponent
  props?: Record<string, any>
}

/**
 * 渲染Vue组件的React组件
 *
 * @param props Vue组件及其props
 * @returns 渲染Vue组件的React组件
 */
export const VueInReact: React.FC<VueInReactProps> = ({ component, props = {} }) => {
  // 创建一个ref来存储Vue将要渲染的DOM元素
  const containerRef = useRef<HTMLDivElement>(null)
  // 使用state来跟踪Vue应用实例
  const [_vueApp, setVueApp] = useState<any>(null)
  // 使用state来跟踪prop变化并强制重新渲染
  const [vueProps, setVueProps] = useState(props)

  // 监听对props的变化
  useEffect(() => {
    setVueProps(props)
  }, [props])

  // 在挂载时初始Vue应用，在卸载时清理
  useEffect(() => {
    if (!containerRef.current) return

    // 创建一个Vue包装组件，用于渲染我们的目标组件
    const WrapperComponent = defineComponent({
      render() {
        return h(component, vueProps)
      },
    })

    // 创建并挂载Vue应用
    const app = createApp(WrapperComponent)
    app.mount(containerRef.current)
    setVueApp(app)

    // 在组件卸载时清理Vue应用
    return () => {
      if (app) {
        app.unmount()
      }
    }
  }, [component, containerRef, vueProps])

  // 返回一个div，用作容纳Vue组件的容器
  return <div ref={containerRef} className="vue-in-react-container" />
}
