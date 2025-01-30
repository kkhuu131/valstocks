import { Stock } from "../../context/StocksContext";

const StockPriceChange = ({ firstPrice, secondPrice }: { firstPrice: number, secondPrice: number }) => {
    // Calculate the price change (recent - latest)
    const priceChange = (firstPrice - secondPrice);

    // Calculate the percentage change ((recent - latest) / latest * 100)
    const percentageChange = Math.abs(((firstPrice - secondPrice) / secondPrice) * 100);

    if (priceChange < 0) {
        return (
            <p className={`text-green`}>
                ${Math.abs(priceChange).toFixed(2)} ({(percentageChange).toFixed(2)}%)
            </p>
        );
    }

    if (priceChange > 0) {
        return (
            <p className={`text-red`}>
                ${Math.abs(priceChange).toFixed(2)} ({(percentageChange).toFixed(2)}%)
            </p>
        );
    }

    return (
        <p className={`text-gray-500`}>
            ${Math.abs(0).toFixed(2)} ({(0)}%)
        </p>
    );
};

export default StockPriceChange;

  