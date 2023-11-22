import React from 'react'
import cn from 'classnames'
import { useTheme } from 'core'
import { Heading } from 'src/utils/get-headings'
import { useScrollSpy } from 'src/utils/use-scroll-spy'

interface SidebarHeadingProps {
  headings: Heading[]
}

function Sidebar({ headings, ...props }: SidebarHeadingProps) {
  const theme = useTheme()

  const activeId = useScrollSpy(
    headings.map(({ id }) => `[id="${id}"]`),
    {
      rootMargin: '0% 0% -80% 0%'
    }
  )

  if (headings.length <= 0) return null

  return (
    <div className="container" {...props}>
      <span className="title">Contents</span>
      <ul className="list">
        {headings.map((heading, i) => (
          <li
            key={i}
            className={cn('list-item', {
              active: activeId == heading.id
            })}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .container {
          position: relative;
        }
        .title {
          font-size: 1.2rem;
          font-weight: 600;
          z-index: 1;
        }
        .list {
          max-height: 56vh;
          margin-bottom: 20px;
          overflow: auto;
          margin: 0;
          margin-top: 5px;
          margin-left: 17px;
        }
        .list::-webkit-scrollbar {
          width: 0px;
        }
        .title,
        .list-item {
          max-width: 100%;
          text-align: left;
        }
        .list-item:before {
          display: none;
        }
        .list-item {
          padding-left: 1rem;
          position: relative;
          list-style-type: none;
          margin-bottom: 0;
        }
        .list-item a {
          font-size: 0.8rem;
          font-weight: 400;
          color: ${theme.palette.accents_6};
        }
        .list-item.active a {
          color: ${theme.palette.accents_8};
          font-weight: 600;
        }
        .list-item:after {
          content: '';
          position: absolute;
          top: 50%;
          right: auto;
          left: 0;
          width: 5px;
          height: 5px;
          opacity: 0;
          border-radius: 10px;

          background: ${theme.palette.accents_7};
          transform: translateY(-50%);
          transition: opacity 0.25s ease;
        }
        .list-item.active:after {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

export default Sidebar
