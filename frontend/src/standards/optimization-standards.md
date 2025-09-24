# 🚀 Estándares de Optimización - BookTracker

## 📋 **Reglas Obligatorias para Nuevos Componentes**

### **1. React.memo para Componentes** ⚡
```typescript
// ✅ CORRECTO
const MyComponent: React.FC<Props> = memo(({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
});

MyComponent.displayName = 'MyComponent';
```

### **2. useCallback para Funciones** 🔧
```typescript
// ✅ CORRECTO
const handleClick = useCallback((id: string) => {
  // lógica
}, [dependency]);

// ❌ INCORRECTO
const handleClick = (id: string) => {
  // lógica - se recrea en cada render
};
```

### **3. Lazy Loading para Páginas** 📦
```typescript
// ✅ CORRECTO
const MyPage = lazy(() => import('./MyPage'));

// En el componente padre
<Suspense fallback={<PageLoader />}>
  <MyPage />
</Suspense>
```

### **4. Selectores Específicos de Zustand** 🎯
```typescript
// ✅ CORRECTO - Selector específico
const user = useAuthStore(state => state.user);

// ❌ INCORRECTO - Todo el store
const { user, loading, error } = useAuthStore();
```

### **5. Clases Tailwind en lugar de estilos inline** 🎨
```typescript
// ✅ CORRECTO
<div className="bg-primary-500 text-white p-4" />

// ❌ INCORRECTO
<div style={{ backgroundColor: colors.primary.main, color: 'white', padding: '1rem' }} />
```

### **6. Transiciones Optimizadas** ⚡
```typescript
// ✅ CORRECTO - Transiciones específicas y rápidas
className="transition-colors duration-150"

// ❌ INCORRECTO - Transiciones lentas y generales
className="transition-all duration-300"
```

### **7. Error Boundaries** 🛡️
```typescript
// ✅ CORRECTO - Siempre envolver componentes críticos
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### **8. Loading States** ⏳
```typescript
// ✅ CORRECTO - Siempre mostrar loading states
<Suspense fallback={<PageLoader message="Cargando..." />}>
  <LazyComponent />
</Suspense>
```

## 📊 **Métricas de Rendimiento Objetivo**

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| **First Contentful Paint** | < 1.5s | Lighthouse |
| **Largest Contentful Paint** | < 2.5s | Lighthouse |
| **Cumulative Layout Shift** | < 0.1 | Lighthouse |
| **Time to Interactive** | < 3s | Lighthouse |
| **Bundle Size** | < 500KB | Webpack Bundle Analyzer |

## 🔍 **Checklist de Optimización**

### **Antes de crear un componente:**
- [ ] ¿Necesita React.memo?
- [ ] ¿Tiene funciones que necesitan useCallback?
- [ ] ¿Es una página que necesita lazy loading?
- [ ] ¿Usa selectores específicos de Zustand?
- [ ] ¿Tiene estilos inline que se pueden convertir a Tailwind?

### **Antes de hacer commit:**
- [ ] ¿Hay re-renders innecesarios?
- [ ] ¿Las transiciones son fluidas?
- [ ] ¿Hay loading states apropiados?
- [ ] ¿Está envuelto en ErrorBoundary?
- [ ] ¿El bundle size es aceptable?

## 🎯 **Patrones Prohibidos**

### **❌ NUNCA hacer:**
1. **Estilos inline** - Usar siempre Tailwind
2. **Re-renders innecesarios** - Usar React.memo y selectores específicos
3. **Transiciones lentas** - Máximo 150ms
4. **Componentes sin lazy loading** - Páginas siempre lazy
5. **Funciones sin useCallback** - En props de componentes memoizados
6. **Sin Error Boundaries** - Componentes críticos siempre protegidos
7. **Sin Loading States** - Siempre mostrar feedback al usuario

## 🚀 **Patrones Recomendados**

### **✅ SIEMPRE hacer:**
1. **Componentes memoizados** - React.memo por defecto
2. **Funciones estables** - useCallback para funciones en props
3. **Lazy loading** - Páginas y componentes pesados
4. **Selectores específicos** - Solo lo que necesitas del store
5. **Clases Tailwind** - CSS pre-compilado
6. **Transiciones rápidas** - 150ms máximo
7. **Error Boundaries** - Protección contra crashes
8. **Loading States** - Feedback visual constante

---

**📝 Nota:** Estos estándares son obligatorios para mantener la eficiencia del frontend. Revisar antes de cada implementación.
