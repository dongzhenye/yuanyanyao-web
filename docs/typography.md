# 原研药查询 - 字体设计规范

## 一、字号规范

我们使用六个标准字号，从大到小依次为：

### display (32px/24px)
- 用途：展示型大标题
- 适用场景：
  - 首页主标题
  - 营销页面大标题
- Tailwind类：text-4xl (24px), md:text-5xl (32px)

### title (18px)
- 用途：主要内容标题
- 适用场景：
  - 药品商品名
  - 药品产品名
  - 页面板块标题
- Tailwind类：text-lg

### input (18px)
- 用途：输入类文字
- 适用场景：
  - 搜索框文字
  - 表单输入框
- Tailwind类：text-lg

### base (16px)
- 用途：次要标题
- 适用场景：
  - 板块副标题
  - 重要说明文字
- Tailwind类：text-base

### body (14px)
- 用途：正文内容
- 适用场景：
  - 原研药标签
  - 厂商名称
  - 统计数字
  - 热门搜索标签
- Tailwind类：text-[14px]

### caption (12px)
- 用途：辅助性文字
- 适用场景：
  - 分隔符号
  - 时间日期
  - 提示性文字
- Tailwind类：text-sm

## 二、字重规范

### bold (700)
- 用途：重点强调
- 适用场景：
  - 首页主标题
  - 药品商品名
  - 页面主标题
- Tailwind类：font-bold

### medium (500)
- 用途：次要强调
- 适用场景：
  - 统计数字
  - 功能性标签
  - 搜索框文字
- Tailwind类：font-medium

### regular (400)
- 用途：常规文字
- 适用场景：
  - 药品产品名
  - 正文内容
  - 厂商名称
- Tailwind类：font-normal

## 三、颜色规范

### 主要文字颜色

#### text-primary (#2563EB)
- 用途：品牌主色
- 适用场景：
  - 原研药标签
  - 统计数字
  - 可交互元素
- Tailwind类：text-primary

#### text-dark (#111827)
- 用途：重要文字
- 适用场景：
  - 首页主标题
  - 药品商品名
  - 药品产品名
- Tailwind类：text-gray-900

#### text-normal (#4B5563)
- 用途：正文内容
- 适用场景：
  - 厂商名称
  - 热门搜索标签
  - 说明文字
- Tailwind类：text-gray-600

#### text-light (#9CA3AF)
- 用途：辅助文字
- 适用场景：
  - 分隔符号
  - 占位文字
  - 次要提示
- Tailwind类：text-gray-400

### 状态颜色

#### text-hover (#1D4ED8)
- 用途：悬停状态
- 适用场景：
  - 链接悬停
  - 按钮悬停
- Tailwind类：hover:text-primary-dark

#### text-success (#10B981)
- 用途：成功/OTC状态
- 适用场景：
  - OTC药品标签
- Tailwind类：text-success

#### text-warning (#F59E0B)
- 用途：警告/处方状态
- 适用场景：
  - 处方药标签
- Tailwind类：text-warning

## 四、组合示例

### 首页主标题
```tsx
<h1 className="text-4xl md:text-5xl font-bold text-gray-900">
  原研药查询
</h1>
```

### 搜索框
```tsx
<input
  className="text-lg font-medium text-gray-900 placeholder:text-gray-400"
  placeholder="输入药品名称、拼音或简拼搜索"
/>
```

### 统计数字
```tsx
<div className="flex items-center text-[14px]">
  <span className="text-gray-600">已收录</span>
  <span className="font-medium text-primary">13</span>
  <span className="text-gray-600">种药品</span>
</div>
```

### 药品列表项
```tsx
<div>
  {/* 商品名 */}
  <h2 className="text-lg font-bold text-gray-900">拜阿司匹灵®</h2>
  
  {/* 产品名 */}
  <div className="text-lg font-normal text-gray-900">阿司匹林肠溶片</div>
  
  {/* 原研药标签 */}
  <span className="text-[14px] font-medium text-primary">原研药</span>
  
  {/* 厂商名称 */}
  <div className="text-[14px] font-normal text-gray-600">拜耳医药保健有限公司</div>
</div>
```

## 五、注意事项

1. **一致性原则**
   - 相同场景使用相同的字号和字重组合
   - 保持颜色的语义一致性

2. **响应式设计**
   - 特大字号(display)需要考虑移动端适配
   - 确保在各种设备上的可读性

3. **可访问性**
   - 保持足够的颜色对比度
   - 重要信息不仅依赖颜色区分

4. **简化选择**
   - 优先使用规范中定义的标准尺寸
   - 避免创建新的字号和颜色变体 