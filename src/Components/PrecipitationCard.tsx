import precipitationIcon from "../assets/icons_32/precipitation_32.png";
import "./PrecipitationCard.css";
interface IPrecipitationCardProps {
    weekday: string;
    data: {
        unit: string;
        precipitationChance: number;
    };
}
export default function PrecipitationCard({ weekday, data }: IPrecipitationCardProps) {
    return (
        <div className="precipitation-card">
            <h2>{weekday}</h2>
            <img className="precipitation-icon" src={precipitationIcon} alt="precipitation icon" />
            <p className="precipitation-text">{`${data.precipitationChance}${data.unit}`}</p>
        </div>
    );
}
