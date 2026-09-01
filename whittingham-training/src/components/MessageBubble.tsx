import type { ChatMessage } from '../../shared/types.ts'

export function MessageBubble({ message, personaLabel }: { message: ChatMessage; personaLabel: string }) {
  const isAgent = message.role === 'agent'
  return (
    <div className={'flex ' + (isAgent ? 'justify-end' : 'justify-start')}>
      <div className={'max-w-[80%] ' + (isAgent ? 'items-end' : 'items-start') + ' flex flex-col gap-1'}>
        <span className="px-1 text-[11px] font-medium text-wt-muted">{isAgent ? 'You' : personaLabel}</span>
        <div
          className={
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ' +
            (isAgent
              ? 'bg-wt-blue text-white rounded-br-sm'
              : 'bg-wt-panel-light text-wt-text border border-wt-border rounded-bl-sm')
          }
        >
          {message.text}
        </div>
      </div>
    </div>
  )
}
