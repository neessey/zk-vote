/* eslint-disable @next/next/no-img-element */
const posts = [
    {
        id: 1,
        title: 'Comment organiser un vote en ligne sécurisé',
        href: '#',
        description:
            'Découvrez les meilleures pratiques pour assurer la sécurité et l’intégrité de vos scrutins en ligne.',
        date: 'Déc 28, 2025',
        datetime: '2025-12-28',
        category: { title: 'Sécurité', href: '#' },
        author: {
            name: 'Yaniss Elie',
            role: 'Développeuse / Experte en vote en ligne',
            href: '#',
            imageUrl:
                'https://images.unsplash.com/photo-1765172302295-ba8396cdab64?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
    {
        id: 2,
        title: 'Les différents types de vote expliqués',
        href: '#',
        description:
            'Vote à option unique, vote par liste, vote anticipé… Nous expliquons les avantages et inconvénients de chaque méthode.',
        date: 'Déc 25, 2025',
        datetime: '2025-12-25',
        category: { title: 'Méthodes', href: '#' },
        author: {
            name: 'Yaniss Elie',
            role: 'Développeuse / Experte en vote en ligne',
            href: '#',
            imageUrl:
                'https://images.unsplash.com/photo-1765172302295-ba8396cdab64?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
    {
        id: 3,
        title: 'Garantir l’anonymat et la fiabilité du scrutin',
        href: '#',
        description:
            'Apprenez comment protéger l’identité des votants tout en assurant la traçabilité et la transparence des résultats.',
        date: 'Déc 20, 2025',
        datetime: '2025-12-20',
        category: { title: 'Confidentialité', href: '#' },
        author: {
            name: 'Yaniss Elie',
            role: 'Développeuse / Experte en vote en ligne',
            href: '#',
            imageUrl:
                'https://images.unsplash.com/photo-1765172302295-ba8396cdab64?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
]

export default function Blog() {
    return (
        <div className="mt-10 sm:mt-16 grid gap-8 sm:gap-12 lg:gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <article key={post.id} className="flex flex-col items-start justify-between h-full">
                    <div className="w-full">
                        <div className="flex items-center gap-x-3 sm:gap-x-4 text-xs">
                            <time dateTime={post.datetime} className="text-gray-500">
                                {post.date}
                            </time>
                            <a
                                href={post.category.href}
                                className="relative z-10 rounded-full bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                {post.category.title}
                            </a>
                        </div>
                        <div className="group relative grow mt-3">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-gray-600 line-clamp-2">
                                <a href={post.href}>
                                    <span className="absolute inset-0" />
                                    {post.title}
                                </a>
                            </h3>
                            <p className="mt-3 sm:mt-5 line-clamp-3 text-sm text-gray-600">
                                {post.description}
                            </p>
                        </div>
                    </div>
                    <div className="relative mt-6 sm:mt-8 flex items-center gap-x-3 sm:gap-x-4 w-full">
                        <img
                            alt={post.author.name}
                            src={post.author.imageUrl}
                            className="w-10 h-10 rounded-full bg-gray-50 object-cover shrink-0"
                        />
                        <div className="text-sm min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 truncate">
                                <a href={post.author.href}>
                                    <span className="absolute inset-0" />
                                    {post.author.name}
                                </a>
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm truncate">
                                {post.author.role}
                            </p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}