const StockPriceChange = ({ firstPrice, secondPrice }: { firstPrice: number, secondPrice: number }) => {
    // Calculate the price change (recent - latest)
    const priceChange = (firstPrice - secondPrice);

    // Calculate the percentage change ((recent - latest) / latest * 100)
    const percentageChange = ((firstPrice - secondPrice) / secondPrice) * 100;

    if (priceChange < 0) {
        return (
            <p className={`text-green`}>
                +${Math.abs(priceChange).toFixed(2)} (+{Math.abs(percentageChange).toFixed(2)}%)
            </p>
        );
    }

    if (priceChange > 0) {
        return (
            <p className={`text-red`}>
                -${Math.abs(priceChange).toFixed(2)} (-{Math.abs(percentageChange).toFixed(2)}%)
            </p>
        );
    }

    return (
        <p className={`text-gray-500`}>
            $0.00 (0%)
        </p>
    );
};

export default StockPriceChange;

  