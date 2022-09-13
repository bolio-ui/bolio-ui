import React from 'react'
import { useTheme } from 'core'

const AttributesTable: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const theme = useTheme()

  return (
    <div className="attr">
      {children}
      <style jsx global>{`
        .attr .pre {
          margin-top: 12px !important;
        }
        .attr table {
          margin-top: 12px;
          margin-right: ${theme.layout.gap};
        }
        .attr h4.title {
          margin-top: calc(${theme.layout.gap} * 2.2);
        }
        .attr h4.title:first-of-type {
          margin-top: 0;
        }
        .attr table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
        }
        .attr thead th td {
          height: 2.5rem;
        }
        .attr tbody tr td {
          height: 3.333rem;
        }
        .attr th,
        .attr td {
          padding: 0 0.625rem;
          text-align: left;
        }
        .attr th {
          height: 2.5rem;
          color: ${theme.palette.accents_4};
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0;
          background: ${theme.palette.accents_2};
        }
        .attr th:nth-child(1) {
          border-radius: 4px 0 0 4px;
        }
        .attr th:last-child {
          border-radius: 0 4px 4px 0;
        }
        .attr tr td {
          color: ${theme.palette.accents_6};
          font-size: 0.875rem;
          height: 2.5rem;
        }
        .attr td:nth-child(1) {
          border-left: 1px solid transparent;
        }
        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          .attr {
            overflow-x: scroll;
          }
          .attr::-webkit-scrollbar {
            width: 0;
            height: 0;
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  )
}

export default AttributesTable
