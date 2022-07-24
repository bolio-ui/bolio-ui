import React from 'react'

export const __html =
  `<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> useState <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">"react"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function"><span class="token maybe-class-name">App</span></span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>wait<span class="token punctuation">,</span> showWaitTime<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=&gt;</span> <span class="token function">showWaitTime</span><span class="token punctuation">(</span>wait <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">You've been waiting since </span><span class="token punctuation">{</span>wait<span class="token punctuation">}</span><span class="token plain-text"> seconds!</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>
`.trim()

const WaitTime: React.FC<unknown> = () => (
  <code className="language-jsx" dangerouslySetInnerHTML={{ __html }} />
)

export default WaitTime
