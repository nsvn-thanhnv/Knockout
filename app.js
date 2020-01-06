class KoApp {
    current = ko.observable(new Book());

    books = ko.observableArray([
        new Book('1', { title: 'Book 1', description: 'Desc 1', date: new Date() }),
        new Book('2', { title: 'Book 2', description: 'Desc 2', date: new Date() }),
    ]);

    constructor() {
        var vm = this,
            current = vm.current();

        ko.computed(() => {
            console.log('computed 1', current.id());

            var title = ko.toJS(current.title);

            return current.id();
        });

        ko.computed({
            read() {
                var x = undefined;
                console.log('computed 2', current.id());

                Promise.resolve(3)
                    .then((v) => {
                        setTimeout(() => {
                            x = v;
                        }, 1000);
                    });

                console.log(x);

                return x;
            }/*,
                write(value) {
                    
                }*/
        });

        current.id.subscribe((v) => {
            console.log('subscribe 1', v);

            Promise.resolve(3)
                .then((v) => {
                    setTimeout(() => {
                        current.id(v);
                    }, 1000);
                });
        });

        current.id.subscribe((v) => {
            var title = ko.toJS(current.title);
            console.log('subscribe 2', v);
        });


    }

    add() {
        this.current(new Book('', {}));
    }

    update(book) {
        const b = ko.toJS(book)

        this.current().id(b.id);
        this.current().update(b);
    }

    delete(id) {
        this.books.remove(b => ko.toJS(b.id) === ko.toJS(id));
    }

    save() {
        var vm = this;
        var current = ko.toJS(vm.current);

        if (current.id) {
            // update
            var updating = null;

            for (var i in vm.books()) {
                var b = vm.books()[i];

                if (ko.toJS(b).id === current.id) {
                    updating = b;
                    break;
                }
            }

            if (updating) {
                updating.update(current);
            }
        } else {
            // insert
            vm.books.push(new Book(vm.books.length, current));
        }

        vm.add();
    }
}

class Book {
    id = ko.observable('');
    title = ko.observable('');
    description = ko.observable('');

    date = ko.observable(null);

    constructor(id, params) {
        this.id(id);

        this.update(params);
    }

    update(params) {
        if (params) {
            if (params.title !== null || params.title !== undefined) {
                this.title(params.title);
            }

            if (params.description !== null || params.description !== undefined) {
                this.description(params.description);
            }

            if (params.date !== null || params.date !== undefined) {
                this.date(params.date);
            }
        }
    }
}

ko.bindingHandlers.date = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        element.innerText = moment(valueAccessor()()).format('YYYY-MM-DD');
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        element.innerText = moment(valueAccessor()()).format('YYYY-MM-DD');
    }
};

ko.applyBindings(new KoApp(), document.body);