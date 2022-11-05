export type EmbeddedSectionProps = React.SVGProps<SVGForeignObjectElement> & {
  x: number;
  y: number;
  width: string;
  height: string;
  element: React.ReactElement;
};

type EmbeddableSections = 'title' | 'type';

export type CardRenderProps = Partial<Record<EmbeddableSections, string | EmbeddedSectionProps>> & {
  artUrl?: string;
  children?: React.ReactNode;
};

function EmbeddedSection({ x, y, width = '100%', height, element }: EmbeddedSectionProps) {
  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      {element}
    </foreignObject>
  );
}

export default function CardRender({ title = '', type = '', artUrl, children }: CardRenderProps) {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 744 1039"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="pinline-shadow" colorInterpolationFilters="sRGB">
        <feDropShadow dx="-3" dy="3" stdDeviation="1" floodOpacity="0.6" />
      </filter>

      <image id="background" href="/background-w.webp" width="100%" height="100%" />

      <path
        id="border"
        d="M30 868s0 19.8 9 35c6.2 10.4 11 15 11 15H30zm684 0s0 19.8-9 35c-6.2 10.4-10 14-10 14v1h19Zm30-834a34 34 0 0 0-34-34H34A34 34 0 0 0 0 34v971a34 34 0 0 0 34 34h676a34 34 0 0 0 34-34zm-30 10a14 14 0 0 0-14-14H44a14 14 0 0 0-14 14v874h20l.3 47H695v-47h19Z"
      />

      <svg
        clipRule="evenodd"
        fillRule="evenodd"
        viewBox="-37 16 671 923"
        xmlns="http://www.w3.org/2000/svg"
        width="671"
        overflow="visible"
      >
        <image id="textbox" href="/text-w.svg" x="17" y="609" width="636" />

        <path
          id="pinlines"
          d="m16 606s-12-11-12-33 12-33 12-33h639s12 11 12 33-12 33-12 33zm0-602s-12 11-12 33 12 33 12 33h639s12-11 12-33-12-33-12-33zm639 66h-639v470h639zm0 536h-639v314h639z"
          fill="none"
          stroke="#f7f7ef"
          strokeWidth="6"
          filter="url(#pinline-shadow)"
        />

        <svg
          id="twins"
          viewBox="0 0 656 535"
          width="100%"
          height="535"
          y="8"
          fontFamily="Beleren"
          fontWeight="bold"
          overflow="visible"
        >
          <svg id="title" viewBox="0 0 661 61" width="100%" height="61">
            <image href="/title-w.webp" width="100%" height="100%" />
            {typeof title === 'string' ? (
              <text x="18" y="43" fontSize="40">
                {title}
              </text>
            ) : (
              <EmbeddedSection {...title} />
            )}
          </svg>
          <svg id="type" viewBox="0 0 661 61" width="100%" height="61" y="100%">
            <image href="/type-w.webp" width="100%" height="100%" />
            {typeof type === 'string' ? (
              <text x="18" y="40" fontSize="34" letterSpacing="-0.1">
                {type}
              </text>
            ) : (
              <EmbeddedSection {...type} />
            )}
          </svg>
        </svg>

        <svg
          id="art"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          clipRule="evenodd"
          viewBox="0 0 633 465"
          x="19"
          y="73"
          width="633"
          height="465"
        >
          <image clipPath="url(#artmask)" xlinkHref={artUrl} width="100%" height="100%" />
          <clipPath id="artmask">
            <path d="M0 0h633v465H0z" fill="#000" fillRule="nonzero" />
          </clipPath>
          <path d="M633 0H0v465h633zm-3 3v459H3V3z" />
        </svg>
      </svg>

      <svg
        viewBox="0 0 274 144"
        x="572"
        y="919"
        width="274"
        height="144"
        fontFamily="Beleren"
        overflow="visible"
      >
        <image href="/pt-w.webp" transform="scale(0.5)" />
        <text x="69" y="39" fontSize="38" textAnchor="middle" dominantBaseline="middle">
          1/1
        </text>
      </svg>

      {children}
    </svg>
  );
}
