import './ProductCard.css'

function ProductCard({ image, title, description, price }) {
  return (
    <div className="product-card">
      <img src={image} alt={title} />

      <div className="product-info">
        <h4>{title}</h4>
        <p>{description}</p>
        <span className="price">{price}</span>

        <button>Comprar</button>
      </div>
    </div>
  )
}

export default ProductCard
