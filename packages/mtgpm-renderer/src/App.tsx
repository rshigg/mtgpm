import * as React from 'react';
import CardRender, { EmbeddedSectionProps } from './index';

const artworkUrl =
	'https://cards.scryfall.io/art_crop/front/f/6/f657f2dc-adc8-4a66-b081-a71b3a127389.jpg?1654566443';

const title: EmbeddedSectionProps = {
	x: 0,
	y: 0,
	width: '100%',
	height: '100%',
	element: (
		<span className="text-[2.5rem] p-4 whitespace-nowrap leading-0" contentEditable>
			Mothrider Patrol
		</span>
	),
};

function App() {
	const [opacity, setOpacity] = React.useState(0.0);

	return (
		<div className="grid grid-cols-3 gap-4 w-screen h-screen p-4">
			<div className="col-start-2 col-span-1">
				<CardRender title={title}>
					<image
						href="/test-w.png"
						width="100%"
						height="100%"
						opacity={opacity}
						className="pointer-events-none"
					/>
				</CardRender>
			</div>
			<div className="flex items-center">
				<label className="flex flex-col gap-1 uppercase font-semibold text-sm max-w-xs">
					<span>Overlay opacity: {(opacity * 100).toFixed(0)}%</span>
					<input
						type="range"
						value={opacity * 100}
						onChange={(e) => setOpacity(Number(e.target.value) / 100)}
					/>
				</label>
			</div>
		</div>
	);
}

export default App;
