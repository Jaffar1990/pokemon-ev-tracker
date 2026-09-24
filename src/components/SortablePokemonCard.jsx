import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PokemonCard } from './PokemonCard';

export function SortablePokemonCard({ pokemon, ...cardProps }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: pokemon.instanceId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined
  };

  return (
    <div ref={setNodeRef} className={`sortable-pokemon-card${isDragging ? ' is-dragging' : ''}`} style={style}>
      <PokemonCard
        pokemon={pokemon}
        {...cardProps}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
